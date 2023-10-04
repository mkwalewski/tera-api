"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const express = require("express");
const adminApiController = require("../../controllers/adminApi.controller");

/**
* @param {modules} modules
*/
module.exports = modules => express.Router()
	.get("/info", adminApiController.infoStats(modules))
;