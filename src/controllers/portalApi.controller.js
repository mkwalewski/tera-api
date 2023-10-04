"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const {resultJson} = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.infoStats = ({ logger, serverModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		try {
			const serversItems = [];
			serverModel.info.findOne({ where: { serverId: 2800 } }).then(server => {
				if (server === null) {
					return resultJson(res, 50000, "server not exist");
				}
				serversItems.push({
					isAvailable: server.get("isAvailable"),
					nameString: server.get("nameString"),
					usersTotal: server.get("usersTotal"),
					usersOnline: server.get("usersOnline"),
				});
			}).catch(err => {
				logger.error(err);
				resultJson(res, 1, { msg: "internal error" });
			});
			resultJson(res, 0, {
				msg: "success",
				servers: serversItems
			});
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		}
	}
];