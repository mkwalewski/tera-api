"use strict";

const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const moment = require("moment-timezone");
const I18n = require("i18n").I18n;
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const shopModel = require("../models/shop.model");
const { i18n, i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

const shopLocales = (new I18n({ directory: path.resolve(__dirname, "../locales/shop") })).getLocales();

module.exports.index = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	async (req, res) => {
		const { categoryId } = req.query;

		try {
			shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
			shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

			const categories = await shopModel.categories.findAll({
				include: [{
					model: shopModel.categoryStrings,
					where: { language: i18n.getLocale() },
					required: false,
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.categoryStrings.sequelize.col("title"), "title"]
					]
				},
				order: [
					["sort", "DESC"]
				]
			});

			const categoriesAssoc = {};

			if (categories !== null) {
				categories.forEach(category =>
					categoriesAssoc[category.get("id")] = category.get("title")
				);
			}

			shopModel.products.belongsTo(shopModel.productStrings, { foreignKey: "id" });
			shopModel.products.hasOne(shopModel.productStrings, { foreignKey: "productId" });

			const products = await shopModel.products.findAll({
				where: {
					...categoryId ? { categoryId } : {}
				},
				include: [{
					model: shopModel.productStrings,
					where: {
						language: i18n.getLocale()
					},
					attributes: [],
					required: false
				}],
				attributes: {
					include: [
						[shopModel.productStrings.sequelize.col("title"), "title"],
						[shopModel.productStrings.sequelize.col("description"), "description"]
					]
				},
				order: [
					["sort", "DESC"]
				]
			});

			if (products === null) {
				return res.send();
			}

			const promises = [];
			const productsMap = new Map();

			shopModel.productItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
			shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

			products.forEach(product => {
				productsMap.set(product.get("id"), {
					sort: product.get("sort"),
					categoryId: product.get("categoryId"),
					categoryTitle: categoriesAssoc[product.get("categoryId")] || "",
					price: product.get("price"),
					title: product.get("title"),
					description: product.get("description"),
					icon: product.get("icon"),
					rareGrade: product.get("rareGrade"),
					active: product.get("active"),
					published:
						product.get("active") &&
						moment().isSameOrAfter(moment(product.get("validAfter"))) &&
						moment().isSameOrBefore(moment(product.get("validBefore"))),
					itemCount: null
				});

				promises.push(shopModel.productItems.findOne({
					where: { productId: product.get("id") },
					include: [{
						model: shopModel.itemTemplates,
						include: [{
							model: shopModel.itemStrings,
							where: {
								language: i18n.getLocale()
							},
							attributes: []
						}],
						attributes: []
					}],
					attributes: {
						include: [
							[shopModel.productItems.sequelize.col("productId"), "productId"],
							[shopModel.productItems.sequelize.col("boxItemCount"), "boxItemCount"],
							[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
							[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
							[shopModel.itemStrings.sequelize.col("string"), "string"],
							[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
						]
					}
				}));
			});

			const productItemsAssoc = await Promise.all(promises);

			if (productItemsAssoc !== null) {
				for (const productItem of productItemsAssoc) {
					if (productItem === null) {
						break;
					}

					const product = productsMap.get(productItem.get("productId"));

					if (product) {
						if (!product.title) {
							product.title = productItem.get("string");
						}

						if (!product.description) {
							product.description = productItem.get("toolTip");
						}

						if (!product.icon) {
							product.icon = productItem.get("icon");
						}

						if (product.rareGrade === null) {
							product.rareGrade = productItem.get("rareGrade");
						}

						if (!product.itemCount) {
							product.itemCount = productItem.get("boxItemCount");
						}
					}
				}
			}

			res.render("adminShopProducts", {
				layout: "adminLayout",
				categoryId,
				categories: categories || [],
				products: productsMap
			});
		} catch (err) {
			logger.error(err.toString());
			res.send();
		}
	}
];

module.exports.add = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	async (req, res) => {
		const { categoryId, fromCategoryId } = req.query;

		try {
			shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
			shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

			const categories = await shopModel.categories.findAll({
				include: [{
					model: shopModel.categoryStrings,
					where: { language: i18n.getLocale() },
					required: false,
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.categoryStrings.sequelize.col("title"), "title"]
					]
				},
				order: [
					["sort", "DESC"]
				]
			});

			res.render("adminShopProductsAdd", {
				layout: "adminLayout",
				errors: null,
				moment,
				shopLocales,
				categories: categories || [],
				fromCategoryId,
				categoryId,
				validAfter: moment(),
				validBefore: moment().add(2, "years"),
				active: 1,
				price: "",
				title: "",
				description: "",
				icon: "",
				rareGrade: null,
				resolvedItems: [],
				itemTemplateIds: [""],
				boxItemIds: [""],
				boxItemCounts: ["1"],
				validate: 1
			});
		} catch (err) {
			logger.error(err.toString());
			res.send();
		}
	}
];

module.exports.addAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("price").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Price field must contain a valid number.")),
		body("categoryId").trim()
			.custom((value, { req }) => shopModel.categories.findOne({
				where: {
					id: req.body.categoryId
				}
			}).then(data => {
				if (!data) {
					return Promise.reject(i18n.__("Category field must contain an existing category ID."));
				}
			})),
		body("validAfter")
			.isISO8601().withMessage(i18n.__("Valid from field must contain a valid date.")),
		body("validBefore")
			.isISO8601().withMessage(i18n.__("Valid to field must contain a valid date.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Item template ID field has invalid value."))
			.custom(value => shopModel.itemTemplates.findOne({
				where: {
					itemTemplateId: value
				}
			}).then(data => {
				if (value && !data) {
					return Promise.reject(`${i18n.__("A non-existent item has been added")}: ${value}`);
				}
			})),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1 }).withMessage(i18n.__("Box item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Count field has invalid value.")),
		body("itemTemplateIds").notEmpty()
			.withMessage(i18n.__("No items have been added to the product.")),
		// Additional info
		body("icon").optional().trim().toLowerCase()
			.isLength({ max: 2048 }).withMessage(i18n.__("Icon must be between 1 and 255 characters.")),
		body("rareGrade").optional()
			.isIn(["", "0", "1", "2", "3", "4", "5"]).withMessage(i18n.__("Rare grade field has invalid value.")),
		body("title.*").optional().trim()
			.isLength({ max: 1024 }).withMessage(i18n.__("Title must be between 1 and 1024 characters.")),
		body("description.*").optional().trim()
			.isLength({ max: 2048 }).withMessage(i18n.__("Description must be between 1 and 2048 characters."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	async (req, res) => {
		const { categoryId, fromCategoryId } = req.query;
		const { validate, validAfter, validBefore, active, price,
			title, description, icon, rareGrade,
			itemTemplateIds, boxItemIds, boxItemCounts } = req.body;
		const errors = helpers.validationResultLog(req);

		try {
			shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
			shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

			const categories = await shopModel.categories.findAll({
				include: [{
					model: shopModel.categoryStrings,
					where: { language: i18n.getLocale() },
					required: false,
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.categoryStrings.sequelize.col("title"), "title"]
					]
				},
				order: [
					["sort", "DESC"]
				]
			});

			if (!errors.isEmpty() || validate == 1) {
				const itemsPromises = [];

				if (validate && itemTemplateIds) {
					itemTemplateIds.forEach(itemTemplateId => {
						shopModel.itemTemplates.belongsTo(shopModel.itemStrings, { foreignKey: "itemTemplateId" });
						shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

						itemsPromises.push(shopModel.itemTemplates.findOne({
							where: { itemTemplateId },
							include: [{
								model: shopModel.itemStrings,
								where: {
									language: i18n.getLocale()
								},
								attributes: []
							}],
							attributes: {
								include: [
									[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
									[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
									[shopModel.itemStrings.sequelize.col("string"), "string"],
									[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
								]
							}
						}));
					});
				}

				const items = await Promise.all(itemsPromises);
				const resolvedItems = {};

				items.forEach(item => {
					if (item) {
						resolvedItems[item.get("itemTemplateId")] = item;
					}
				});

				return res.render("adminShopProductsAdd", {
					layout: "adminLayout",
					errors: errors.array(),
					moment,
					shopLocales,
					categories,
					fromCategoryId,
					categoryId,
					validAfter: moment(validAfter),
					validBefore: moment(validBefore),
					active,
					price,
					title,
					description,
					icon,
					rareGrade: rareGrade === "" ? null : Number(rareGrade),
					resolvedItems,
					itemTemplateIds: itemTemplateIds || [],
					boxItemIds: boxItemIds || [],
					boxItemCounts: boxItemCounts || [],
					validate: Number(!errors.isEmpty())
				});
			}

			await shopModel.sequelize.transaction(async transaction => {
				const product = await shopModel.products.create({
					categoryId,
					active: active == "on",
					price,
					icon,
					rareGrade: rareGrade === "" ? null : rareGrade,
					validAfter: moment(validAfter).format("YYYY-MM-DD HH:MM:ss"),
					validBefore: moment(validBefore).format("YYYY-MM-DD HH:MM:ss")
				}, {
					transaction
				});

				const promises = [];

				if (itemTemplateIds) {
					itemTemplateIds.forEach((itemTemplateId, i) => {
						if (!itemTemplateId || boxItemIds[i] === undefined || boxItemCounts[i] === undefined) {
							return;
						}

						promises.push(shopModel.productItems.create({
							productId: product.get("id"),
							itemTemplateId,
							boxItemId: boxItemIds[i] || null,
							boxItemCount: boxItemCounts[i]
						}, {
							transaction
						}));
					});
				}

				if (title || description) {
					shopLocales.forEach(language =>
						promises.push(shopModel.productStrings.create({
							productId: product.get("id"),
							...title[language] ? { title: title[language] } : {},
							...description[language] ? { description: description[language] } : {},
							language
						}, {
							transaction
						}))
					);
				}

				await Promise.all(promises);
			});

			res.redirect(`/shop_products?categoryId=${fromCategoryId}`);
		} catch (err) {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		}
	}
];

module.exports.edit = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	async (req, res) => {
		const { id, fromCategoryId } = req.query;

		try {
			shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
			shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

			const categories = await shopModel.categories.findAll({
				include: [{
					model: shopModel.categoryStrings,
					where: { language: i18n.getLocale() },
					required: false,
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.categoryStrings.sequelize.col("title"), "title"]
					]
				},
				order: [
					["sort", "DESC"]
				]
			});

			const product = await shopModel.products.findOne({ where: { id } });

			if (product === null) {
				return res.redirect("/shop_products");
			}

			const strings = await shopModel.productStrings.findAll({
				where: { productId: product.get("id") }
			});

			const title = {};
			const description = {};

			if (strings !== null) {
				strings.forEach(string => {
					title[string.get("language")] = string.get("title");
					description[string.get("language")] = string.get("description");
				});
			}

			shopModel.productItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
			shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

			const productItems = await shopModel.productItems.findAll({
				where: { productId: product.get("id") },
				include: [{
					model: shopModel.itemTemplates,
					include: [{
						model: shopModel.itemStrings,
						where: { language: i18n.getLocale() },
						attributes: []
					}],
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.productItems.sequelize.col("productId"), "productId"],
						[shopModel.productItems.sequelize.col("boxItemCount"), "boxItemCount"],
						[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
						[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
						[shopModel.itemStrings.sequelize.col("string"), "string"],
						[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
					]
				}
			});

			const itemTemplateIds = [];
			const boxItemIds = [];
			const boxItemCounts = [];
			const promises = [];

			if (productItems !== null) {
				productItems.forEach(productItem => {
					itemTemplateIds.push(productItem.get("itemTemplateId"));
					boxItemIds.push(productItem.get("boxItemId"));
					boxItemCounts.push(productItem.get("boxItemCount"));
				});
			}

			itemTemplateIds.forEach(itemTemplateId => {
				shopModel.itemTemplates.belongsTo(shopModel.itemStrings, { foreignKey: "itemTemplateId" });
				shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

				promises.push(shopModel.itemTemplates.findOne({
					where: { itemTemplateId },
					include: [{
						model: shopModel.itemStrings,
						where: {
							language: i18n.getLocale()
						},
						attributes: []
					}],
					attributes: {
						include: [
							[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
							[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
							[shopModel.itemStrings.sequelize.col("string"), "string"],
							[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
						]
					}
				}));
			});

			const items = await Promise.all(promises);
			const resolvedItems = {};

			items.forEach(item => {
				if (item) {
					resolvedItems[item.get("itemTemplateId")] = item;
				}
			});

			res.render("adminShopProductsEdit", {
				layout: "adminLayout",
				errors: null,
				moment,
				shopLocales,
				categories: categories || [],
				id,
				fromCategoryId,
				categoryId: product.get("categoryId"),
				validAfter: moment(product.get("validAfter")),
				validBefore: moment(product.get("validBefore")),
				active: product.get("active"),
				price: product.get("price"),
				sort: product.get("sort"),
				title,
				description,
				icon: product.get("icon"),
				rareGrade: product.get("rareGrade"),
				resolvedItems,
				itemTemplateIds,
				boxItemIds,
				boxItemCounts,
				validate: 0
			});
		} catch (err) {
			logger.error(err.toString());
			res.send();
		}
	}
];

module.exports.editAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("price").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Price field must contain a valid number.")),
		body("sort").trim()
			.isNumeric().withMessage(i18n.__("Sort field must contain the value as a number.")),
		body("categoryId").trim()
			.custom((value, { req }) => shopModel.categories.findOne({
				where: {
					id: req.body.categoryId
				}
			}).then(data => {
				if (!data) {
					return Promise.reject(i18n.__("Category field must contain an existing category ID."));
				}
			})),
		body("validAfter")
			.isISO8601().withMessage(i18n.__("Valid from field must contain a valid date.")),
		body("validBefore")
			.isISO8601().withMessage(i18n.__("Valid to field must contain a valid date.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Item template ID field has invalid value."))
			.custom(value => shopModel.itemTemplates.findOne({
				where: {
					itemTemplateId: value
				}
			}).then(data => {
				if (value && !data) {
					return Promise.reject(`${i18n.__("A non-existent item has been added")}: ${value}`);
				}
			})),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1 }).withMessage(i18n.__("Box item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Count field has invalid value.")),
		body("itemTemplateIds").notEmpty()
			.withMessage(i18n.__("No items have been added to the product.")),
		// Additional info
		body("icon").optional().trim().toLowerCase()
			.isLength({ max: 2048 }).withMessage(i18n.__("Icon must be between 1 and 255 characters.")),
		body("rareGrade").optional()
			.isIn(["", "0", "1", "2", "3", "4", "5"]).withMessage(i18n.__("Rare grade field has invalid value.")),
		body("title.*").optional().trim()
			.isLength({ max: 1024 }).withMessage(i18n.__("Title must be between 1 and 1024 characters.")),
		body("description.*").optional().trim()
			.isLength({ max: 2048 }).withMessage(i18n.__("Description must be between 1 and 2048 characters."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	async (req, res) => {
		const { id, fromCategoryId } = req.query;
		const { validate, categoryId, validAfter, validBefore, active, price, sort,
			title, description, icon, rareGrade,
			itemTemplateIds, boxItemIds, boxItemCounts } = req.body;
		const errors = helpers.validationResultLog(req);

		try {
			if (!id) {
				return res.redirect("/shop_products");
			}

			const product = await shopModel.products.findOne({ where: { id } });

			if (product === null) {
				return res.redirect("/shop_products");
			}

			shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
			shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

			const categories = await shopModel.categories.findAll({
				include: [{
					model: shopModel.categoryStrings,
					where: { language: i18n.getLocale() },
					required: false,
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.categoryStrings.sequelize.col("title"), "title"]
					]
				},
				order: [
					["sort", "DESC"]
				]
			});

			if (!errors.isEmpty() || validate == 1) {
				const itemsPromises = [];

				if (validate && itemTemplateIds) {
					itemTemplateIds.forEach(itemTemplateId => {
						shopModel.itemTemplates.belongsTo(shopModel.itemStrings, { foreignKey: "itemTemplateId" });
						shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

						itemsPromises.push(shopModel.itemTemplates.findOne({
							where: { itemTemplateId },
							include: [{
								model: shopModel.itemStrings,
								where: {
									language: i18n.getLocale()
								},
								attributes: []
							}],
							attributes: {
								include: [
									[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
									[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
									[shopModel.itemStrings.sequelize.col("string"), "string"],
									[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
								]
							}
						}));
					});
				}

				const items = await Promise.all(itemsPromises);
				const resolvedItems = {};

				items.forEach(item => {
					if (item) {
						resolvedItems[item.get("itemTemplateId")] = item;
					}
				});

				return res.render("adminShopProductsEdit", {
					layout: "adminLayout",
					errors: errors.array(),
					moment,
					shopLocales,
					categories,
					id: product.get("id"),
					fromCategoryId,
					categoryId,
					validAfter: moment(validAfter),
					validBefore: moment(validBefore),
					active,
					price,
					sort,
					title,
					description,
					icon,
					rareGrade: rareGrade === "" ? null : Number(rareGrade),
					resolvedItems,
					itemTemplateIds: itemTemplateIds || [],
					boxItemIds: boxItemIds || [],
					boxItemCounts: boxItemCounts || [],
					validate: Number(!errors.isEmpty())
				});
			}

			await shopModel.sequelize.transaction(async transaction => {
				const promises = [
					shopModel.products.update({
						categoryId,
						active: active == "on",
						price,
						sort,
						icon,
						rareGrade: rareGrade === "" ? null : rareGrade,
						validAfter: moment(validAfter).format("YYYY-MM-DD HH:MM:ss"),
						validBefore: moment(validBefore).format("YYYY-MM-DD HH:MM:ss")
					}, {
						where: { id: product.get("id") },
						transaction
					})
				];

				promises.push(shopModel.productItems.destroy({
					where: { productId: product.get("id") },
					transaction
				}));

				if (itemTemplateIds) {
					itemTemplateIds.forEach((itemTemplateId, i) => {
						if (!itemTemplateId || boxItemIds[i] === undefined || boxItemCounts[i] === undefined) {
							return;
						}

						promises.push(shopModel.productItems.create({
							productId: product.get("id"),
							itemTemplateId,
							boxItemId: boxItemIds[i] || null,
							boxItemCount: boxItemCounts[i]
						}, {
							transaction
						}));
					});
				}

				promises.push(shopModel.productStrings.destroy({
					where: { productId: product.get("id") },
					transaction
				}));

				if (title || description) {
					shopLocales.forEach(language =>
						promises.push(shopModel.productStrings.create({
							productId: product.get("id"),
							...title[language] ? { title: title[language] } : {},
							...description[language] ? { description: description[language] } : {},
							language
						}, {
							transaction
						}))
					);
				}

				await Promise.all(promises);
			});

			res.redirect(`/shop_products?categoryId=${fromCategoryId}`);
		} catch (err) {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		}
	}
];

module.exports.deleteAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { id, fromCategoryId } = req.query;

		if (!id) {
			return res.redirect("/shop_products");
		}

		shopModel.sequelize.transaction(transaction =>
			Promise.all([
				shopModel.products.destroy({
					where: { id },
					transaction
				}),
				shopModel.productStrings.destroy({
					where: { productId: id },
					transaction
				}),
				shopModel.productItems.destroy({
					where: { productId: id },
					transaction
				})
			]).then(() =>
				res.redirect(`/shop_products?categoryId=${fromCategoryId}`)
			)
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];