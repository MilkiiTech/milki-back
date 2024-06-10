const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  deleteOne
} = require("../../controllers/woreda/woreda.controller");
const {
createWoredaValidation
} = require("../../validation/woreda/woreda.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
router.post("/create",checkPermission('can_create_woreda_admin'),createWoredaValidation, create);
router.get("/get",checkPermission('can_view_woreda_admin'), findAll);
router.get("/get/:woreda_id",checkPermission('can_view_woreda_admin'), findOne);
router.delete("/delete/:woreda_id",checkPermission('can_delete_woreda_admin'), deleteOne);

module.exports = router;
