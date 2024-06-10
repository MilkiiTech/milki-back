const express = require("express");
const router = express.Router();
const woredaUser = require("./woreda/index")
const zoneUser = require("./zone/index")
const {
  registerUser,
  login,
  createGroup,
  findAll,
  findAllRole,
  findAllPermission,
  assignRolePermission,
  assignMembersToGroup,
  assignRoleToUser
} = require("../controllers/user.controller");
const {
registrationValidation,
loginValidation,
createGroupValidation,
updateGroupValidation,
assignRoleToUserValidation
} = require("../validation/user.validation");
const { checkPermission } = require("../../middlewares/accessControl");
router.post("/signup",checkPermission('can_create_user'),registrationValidation, registerUser);
router.post("/signin",loginValidation, login);
router.use('/woreda',woredaUser);
router.use("/zone", zoneUser);
router.post("/group",checkPermission('can_create_user'), createGroupValidation, createGroup);
router.put("/group/:group_id/assignMember",checkPermission('can_update_group'), updateGroupValidation, assignMembersToGroup);
router.get("/group",checkPermission('can_create_user'), findAll);
router.get("/role", checkPermission('can_view_role'),findAllRole);
router.put("/role/:role_id/assignUser",checkPermission('can_update_user'),assignRoleToUserValidation, assignRoleToUser)
router.get("/permission", checkPermission('can_view_permission'),findAllPermission);
router.post("/assignRolePermission",checkPermission('can_view_permission'), assignRolePermission)
module.exports = router;
