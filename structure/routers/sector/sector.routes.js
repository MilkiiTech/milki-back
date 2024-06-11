const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  update,
  deleteOne
} = require("../../controllers/sector/sector.controller");
const {
createSectorValidation
} = require("../../validation/sector/sector.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
router.post("/create",checkPermission('can_create_sector'),createSectorValidation, create);
router.get("/get",checkPermission('can_view_sector'), findAll);
router.get("/get/:sector_id",checkPermission('can_view_sector'), findOne);
router.delete("/delete/:woreda_id",checkPermission('can_delete_woreda_admin'), deleteOne);

module.exports = router;
