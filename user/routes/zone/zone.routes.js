const express = require("express");
const router = express.Router();
const {
  create
} = require("../../controllers/Zone/zone.controller");
const {
createZoneAdminValidation
} = require("../../validation/ZoneUser/zoneUser.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
router.post("/create",checkPermission('can_create_admin'),createZoneAdminValidation, create);

module.exports = router;
