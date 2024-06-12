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
/**
 * @swagger
 * /structure/zone/create:
 *   post:
 *     summary: Create new  User 
 *     tags: [Zone]
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
router.post("/create",checkPermission('can_create_zone_admin'),createZoneAdminValidation, create);
/**
 * @swagger
 * /structure/zone/get:
 *   get:
 *     summary: Query All Permissions 
 *     tags: [Zone]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/get", checkPermission('can_create_zone_admin'), findAll);
/**
 * @swagger
 * /structure/zone/get/{zone_user_id}:
 *   post:
 *     summary: Assign Role to User
 *     tags: [Zone]
 *     parameters:
 *       - name: zone_user_id
 *         in: path
 *         required: true
 *         description: The ID of the role
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
router.get("/get/:zone_user_id", checkPermission('can_create_zone_admin'), findOne);


module.exports = router;
