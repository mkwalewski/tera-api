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
module.exports.infoStats = ({ logger, serverModel }) => [
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
				resultJson(res, 0, {
					msg: "success",
					isAvailable: server.get("isAvailable"),
					nameString: server.get("nameString"),
					usersTotal: server.get("usersTotal"),
					usersOnline: server.get("usersOnline"),
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