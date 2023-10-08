"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const {resultJson} = require("../middlewares/portalApi.middlewares");
const {requireReload} = require("../utils/helpers");

/**
 * @param {modules} modules
 */
module.exports.infoStats = ({ logger, serverModel, accountModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		try {
			const config = requireReload("../../config/server");
			serverModel.info.findOne({ where: { serverId: config.serverId } }).then(server => {
				if (server === null) {
					return resultJson(res, 50000, "server not exist");
				}
				accountModel.info.count().then(accounts => {
					accountModel.characters.count({ where: { serverId: config.serverId } }).then(characters => {
						resultJson(res, 0, {
							msg: "success",
							isAvailable: server.get("isAvailable"),
							nameString: server.get("nameString"),
							accountsTotal: Number(accounts),
							charactersTotal: Number(characters),
							usersTotal: server.get("usersTotal"),
							usersOnline: server.get("usersOnline"),
						});
					}).catch(err => {
						logger.error(err);
						resultJson(res, 1, { msg: "internal error" });
					});
				}).catch(err => {
					logger.error(err);
					resultJson(res, 1, { msg: "internal error" });
				});
			}).catch(err => {
				logger.error(err);
				resultJson(res, 1, { msg: "internal error" });
			});
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		}
	}
];