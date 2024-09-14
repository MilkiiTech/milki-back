const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  deleteOne
} = require("../../controllers/zone/zone.controller");
const {
createZoneAdminValidation
} = require("../../validation/zone/zone.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
/**
 * @swagger
 * /structure/zone/create:
 *   post:
 *     summary: Create new Zone
 *     tags: [Zone]
 *     requestBody:
 *       description: Request body for creating a new zone
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     sector_name:
 *                       type: string
 *                     role_id:
 *                       type: integer
 *               zoneDetail:
 *                 type: object
 *                 properties:
 *                   zone_name:
 *                     type: string
 *                   city_name:
 *                     type: string
 *                   email_address:
 *                     type: string
 *                   contact_phone_number:
 *                     type: string
 *                   address:
 *                     type: string
 *             example:
 *               users:
 *                 - username: "munir"
 *                   email: "moti@gmail.com"
 *                   phone_number: "+251985654323"
 *                   sector_name: "HR"
 *                   role_id: 6
 *                 - username: "faysal"
 *                   email: "etana@gmail.com"
 *                   phone_number: "+251987667324"
 *                   sector_name: "BULCHA"
 *                   role_id: 6
 *               zoneDetail:
 *                 zone_name: "Arsi245"
 *                 city_name: "Metu"
 *                 email_address: "amaedris1@gmail.com"
 *                 contact_phone_number: "+251987654325"
 *                 address: "Addis Abeba"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: "Zone created successfully"
 *       400:
 *         description: Invalid request
 */
router.post("/create",checkPermission('can_create_zone'),createZoneAdminValidation, create);
/**
 * @swagger
 * /structure/zone/get:
 *   get:
 *     summary: Query All Zone 
 *     tags: [Zone]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/get", checkPermission('can_view_zone'), findAll);
/**
 * @swagger
 * /structure/zone/get/{zone_user_id}:
 *   get:
 *     summary: Fetch Zone by zone_user_id
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
router.get("/get/:zone_user_id", checkPermission('can_view_zone'), findOne);
/**
 * @swagger
 * /structure/zone/{zone_user_id}:
 *   delete:
 *     summary: Delete Zone by zone_user_id
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
router.delete("/:zone_user_id", checkPermission('can_delete_zone'), deleteOne);

module.exports = router;
