const express = require("express");
const router = express.Router();
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
  removeUserFromSector,
  getAllUsers,
  getUserById,
  transferRequest,
  getTransferRequest,
  approveTransferRequest,
  rejectTransferRequest,
  getApprovedTransferRequest,
  getRejectedTransferRequest,
  getPendingTransferRequest,
  activateUser,
  suspendUser,
  requestPasswordReset,
  resetPassword,
  acceptTransferRequest

} = require("../controllers/user.controller");
const {
registrationValidation,
loginValidation,
createGroupValidation,
updateGroupValidation,
assignRoleToUserValidation,
createUserValidation,
assignUserToSectorValidation,
removeUserFromSectorValidation,
transferRequestValidation,
acceptTransferRequestValidation
} = require("../validation/user.validation");
const { checkPermission } = require("../../middlewares/accessControl");
const upload = require("../../config/file-upload");
router.post("/signup",checkPermission('can_create_user'),registrationValidation, registerUser);
// create user that works under sectors only Hr of That level can Do this
/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create new User
 *     tags: [User]
 *     requestBody:
 *       description: Request body for creating a new user
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               employee_id:
 *                 type: string
 *               first_name:
 *                 type: string
 *               middle_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               nationality:
 *                 type: string
 *               marital_status:
 *                 type: string
 *               gender:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               sector_id:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               address:
 *                 type: string
 *               valid_identification:
 *                 type: string
 *                 format: binary
 *               educational_document:
 *                 type: string
 *                 format: binary
 *               gurantee_document:
 *                 type: string
 *                 format: binary
 *             required:
 *               - employee_id
 *               - first_name
 *               - last_name
 *               - nationality
 *               - gender
 *               - username
 *               - email
 *               - phone_number
 *               - sector_id
 *               - role_id
 *               - valid_identification
 *               - educational_document
 *               - gurantee_document
 *             example:
 *               employee_id: "heloo"
 *               first_name: "Amir"
 *               middle_name: "Edris"
 *               last_name: "Ahmed"
 *               nationality: "Ethiopia"
 *               marital_status: "SINGLE"
 *               gender: "MALE"
 *               date_of_birth: "1998-02-03"
 *               username: "asdfghjkld"
 *               email: "amaedris1@gmail.com"
 *               phone_number: "0987654321"
 *               sector_id: "bf2bda19-f0d9-4e90-b715-4f852365b2af"
 *               role_id: 11
 *               address: "Addis Abeba"
 *               valid_identification: "file"
 *               educational_document: "file"
 *               gurantee_document: "file"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               token: {}
 *       400:
 *         description: Invalid request
 */


router.post("/create", checkPermission('can_create_user'),upload,createUserValidation,createUser);
/**
 * @swagger
 * /user/get:
 *   get:
 *     summary: Query All Users 
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/get",checkPermission('can_view_user'), getAllUsers)
router.get("/get/:user_id", checkPermission('can_view_user'), getUserById)
/**
 * @swagger
 * /user/assignUserToSector:
 *   post:
 *     summary: Assign User to Sector
 *     tags: [User]
 *     requestBody:
 *       description: Request body for assigning a user to a sector
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               sector_id:
 *                 type: string
 *               role_id:
 *                 type: integer
 *             example:
 *               user_id: "aa985301-a6ff-49cf-9d86-f433b1766a83"
 *               sector_id: "3208d77c-b033-4890-8150-c1270084cff4"
 *               role_id: 3
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: "User assigned to sector successfully"
 *       400:
 *         description: Invalid request
 */

router.post("/assignUserToSector", checkPermission('can_update_users'),assignUserToSectorValidation, assignUserToSector);
/**
 * @swagger
 * /user/removeUserFromSector:
 *   post:
 *     summary: Remove User from Sector
 *     tags: [User]
 *     requestBody:
 *       description: Request body for removing a user from a sector
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               sector_id:
 *                 type: string
 *             example:
 *               user_id: "e373f145-647a-4ece-9cac-bc6e824f8266"
 *               sector_id: "3208d77c-b033-4890-8150-c1270084cff4"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: "User removed from sector successfully"
 *       400:
 *         description: Invalid request
 */

router.post("/removeUserFromSector", checkPermission('can_update_users'),removeUserFromSectorValidation, removeUserFromSector);
/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: SignIn to System
 *     tags: [User]
 *     requestBody:
 *       description: Request body for SignIn
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *                username: "John Doe"
 *                password: "Colombo - Srilanka "
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               token: {}
 *       400:
 *         description: Invalid request
 */
router.post("/signin",loginValidation, login);
router.post("/group",checkPermission('can_create_user'), createGroupValidation, createGroup);
router.put("/group/:group_id/assignMember",checkPermission('can_update_group'), updateGroupValidation, assignMembersToGroup);
router.get("/group",checkPermission('can_create_user'), findAll);
/**
 * @swagger
 * /user/role:
 *   get:
 *     summary: Query All Roles 
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */

router.get("/role", checkPermission('can_view_role'),findAllRole);
/**
 * @swagger
 * /user/role/{role_id}/assignUser:
 *   post:
 *     summary: Assign Role to User
 *     tags: [Role]
 *     parameters:
 *       - name: role_id
 *         in: path
 *         required: true
 *         description: The ID of the role
 *         schema:
 *           type: integer
 *         example:
 *             3
 *     requestBody:
 *       description: Request body for Assigning Users to Role
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *             example:
 *               user_id: "aa985301-a6ff-49cf-9d86-f433b1766a83"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 *     security:
 *       - bearerAuth: []
 */

router.put("/role/:role_id/assignUser",checkPermission('can_update_user'),assignRoleToUserValidation, assignRoleToUser)
/**
 * @swagger
 * /user/permission:
 *   get:
 *     summary: Query All Permissions 
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */

router.get("/permission", checkPermission('can_view_permission'),findAllPermission);
/**
 * @swagger
 * /user/assignRolePermission:
 *   post:
 *     summary: Assign Role to Permissions
 *     tags: [Permission]
 *     requestBody:
 *       description: Request body for Assigning Role to Permissions
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_id:
 *                 type: integer
 *               permission_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               role_id: 7
 *               permission_ids: [58, 51]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.post("/transferRequest",checkPermission('can_update_user'),transferRequestValidation,transferRequest)
router.post("/accept-transfer-request", checkPermission('can_update_user'),acceptTransferRequestValidation,acceptTransferRequest)
router.post("/reject-transfer-request", checkPermission('can_update_user'),acceptTransferRequestValidation,rejectTransferRequest)
router.get("/transferRequest/pending",checkPermission('can_view_user'),getPendingTransferRequest)
router.get("/transferRequest/approved",checkPermission('can_view_user'),getApprovedTransferRequest)
router.get("/transferRequest/rejected",checkPermission('can_view_user'),getRejectedTransferRequest)
router.put("/transferRequest/:transfer_request_id/approve",checkPermission('can_update_user'),approveTransferRequest)
router.put("/transferRequest/:transfer_request_id/reject",checkPermission('can_update_user'),rejectTransferRequest)
router.post("/assignRolePermission",checkPermission('can_view_permission'), assignRolePermission)
router.patch("/suspend/:user_id",checkPermission('can_update_user'),suspendUser)
router.patch("/activate/:user_id",checkPermission('can_update_user'),activateUser)
router.post("/requestPasswordReset",requestPasswordReset)
router.patch("/resetPassword/:resetToken",resetPassword)




// router.post("/changePassword",checkPermission('can_update_user'),changePasswordValidation,changePassword)
module.exports = router;
