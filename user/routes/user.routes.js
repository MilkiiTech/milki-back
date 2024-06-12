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
/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create new  User 
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
router.post("/create", checkPermission('can_create_user'), creteUserValidation,createUser);
/**
 * @swagger
 * /user/assignUserToSector:
 *   post:
 *     summary: Create new  User 
 *     tags: [User]
 *     requestBody:
 *       description: Request body for Assigning User to Sector
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
 *                 type: string
 *             example:
 *                sector_id: "e373f145-647a-4ece-9cac-bc6e824f8266"
 *                password: "e373f145-647a-4ece-9cac-bc6e824f8266"
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
router.post("/assignUserToSector", checkPermission('can_update_users'),assignUserToSectorValidation, assignUserToSector);
/**
 * @swagger
 * /user/removeUserFromSector:
 *   post:
 *     summary: Create new  User 
 *     tags: [User]
 *     requestBody:
 *       description: Request body for Assigning User to Sector
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
 *                user_id: "e373f145-647a-4ece-9cac-bc6e824f8266"
 *                sector_id: "e373f145-647a-4ece-9cac-bc6e824f8266"
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
 *     summary: Assign Role to User
 *     tags: [Permission]
 *     requestBody:
 *       description: Request body for Assigning Role to Permissions
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: uuid
 *             example:
 *                user_id: "aa985301-a6ff-49cf-9d86-f433b1766a83"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.post("/assignRolePermission",checkPermission('can_view_permission'), assignRolePermission)
module.exports = router;
