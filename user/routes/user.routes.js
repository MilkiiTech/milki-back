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
  assignRoleToUser,
  createUser,
  assignUserToSector,
  removeUserFromSector
} = require("../controllers/user.controller");
const {
registrationValidation,
loginValidation,
createGroupValidation,
updateGroupValidation,
assignRoleToUserValidation,
creteUserValidation,
assignUserToSectorValidation,
removeUserFromSectorValidation
} = require("../validation/user.validation");
const { checkPermission } = require("../../middlewares/accessControl");
router.post("/signup",checkPermission('can_create_user'),registrationValidation, registerUser);
// create user that works under sectors only Hr of That level can Do this
router.post("/create", checkPermission('can_create_user'), creteUserValidation,createUser);
router.post("/assignUserToSector", checkPermission('can_update_users'),assignUserToSectorValidation, assignUserToSector);
router.post("/removeUserFromSector", checkPermission('can_update_users'),removeUserFromSectorValidation, removeUserFromSector);
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
