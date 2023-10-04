"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const express = require("express");
const portalApiController = require("../../controllers/portalApi.controller");

/**
* @param {modules} modules
*/
module.exports = modules => express.Router()
	.get("/info", portalApiController.infoStats(modules))
;