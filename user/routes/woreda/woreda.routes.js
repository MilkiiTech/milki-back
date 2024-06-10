const express = require("express");
const router = express.Router();
const {
  create
} = require("../../controllers/Woreda/woreda.controller");
const {
registrationValidation,
} = require("../../validation/WoredaUser/woredaUser.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
// router.post("/create",checkPermission('can_create_admin'),registrationValidation, create);

module.exports = router;
