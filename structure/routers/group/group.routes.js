const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  addMembers
} = require("../../controllers/group/group.controller");
const {
createGroupValidation,
addMembersToGroupValidation
} = require("../../validation/group/group.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
/**
 * @swagger
 * /structure/group/create:
 *   post:
 *     summary: Create new  Group 
 *     tags: [Group]
 *     requestBody:
 *       description: Request body for creating Group
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
router.post("/create",checkPermission('can_create_group'),createGroupValidation, create);
/**
 * @swagger
 * /structure/group/get:
 *   get:
 *     summary: Query All Group
 *     tags: [Group]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/get",checkPermission('can_view_group'), findAll);
/**
 * @swagger
 * /structure/sector/get/{group_id}:
 *   get:
 *     summary: Query Group by group_id
 *     tags: [Group]
 *     parameters:
 *       - name: group_id
 *         in: path
 *         required: true
 *         description: The ID of the woreda
 *         schema:
 *           type: string
 *         example:
 *             3
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/get/:group_id",checkPermission('can_view_group'), findOne);
/**
 * @swagger
 * /structure/group/{group_id}/member:
 *   post:
 *     summary: Assign Memebers to Group
 *     tags: [Group]
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
router.post("/:group_id/member", checkPermission("can_update_group"), addMembersToGroupValidation,addMembers)
// router.delete("/delete/:woreda_id",checkPermission('can_delete_woreda_admin'), deleteOne);
module.exports = router;
