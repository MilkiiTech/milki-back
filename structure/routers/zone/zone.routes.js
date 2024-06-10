const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne
} = require("../../controllers/zone/zone.controller");
const {
createZoneAdminValidation
} = require("../../validation/zone/zone.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
router.post("/create",checkPermission('can_create_zone_admin'),createZoneAdminValidation, create);
router.get("/get", checkPermission('can_create_zone_admin'), findAll);
router.get("/get/:zone_user_id", checkPermission('can_create_zone_admin'), findOne);


module.exports = router;
