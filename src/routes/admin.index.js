"use strict";

/**
* @typedef {import("../app").modules} modules
*/

/**
* @param {modules} modules
*/
module.exports = modules => {
	modules.app.use("/", require("./admin/admin.routes")(modules));
	modules.app.use("/api", require("./admin/api.routes")(modules));

	modules.app.use((req, res) =>
		res.redirect("/")
	);
};