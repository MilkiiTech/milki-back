const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  update,
  deleteOne,
  getSectorName,
  findAllOwnSector
} = require("../../controllers/sector/sector.controller");
const {
createSectorValidation
} = require("../../validation/sector/sector.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
/**
 * @swagger
 * /structure/sector/create:
 *   post:
 *     summary: Create new Sector and Users
 *     tags: [Sector, User]
 *     requestBody:
 *       description: Request body for creating Sector and associated Users
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
 *                     sector_phone_number:
 *                       type: string
 *                     sector_email_address:
 *                       type: string
 *                     sector_address:
 *                       type: string
 *                     role_id:
 *                       type: integer
 *               woredaDetail:
 *                 type: object
 *                 properties:
 *                   woreda_name:
 *                     type: string
 *                   city_name:
 *                     type: string
 *                   email_address:
 *                     type: string
 *                   contact_phone_number:
 *                     type: string
 *             example:
 *               users: 
 *                 - username: "dsert3"
 *                   email: "tame@gmail.com"
 *                   phone_number: "+251985654321"
 *                   sector_name: "HR"
 *                   sector_phone_number: "+251985654321"
 *                   sector_email_address: "email@gmail.com"
 *                   sector_address: "Addis Abeba"
 *                   role_id: 1
 *                 - username: "amir1234e56"
 *                   email: "muhidin@gmail.com"
 *                   phone_number: "+251987667323"
 *                   sector_name: "BULCHA"
 *                   sector_phone_number: "251985654321"
 *                   sector_email_address: "email@gmail.com"
 *                   sector_address: "Addis Abeba"
 *                   role_id: 1
 *               woredaDetail:
 *                 woreda_name: "Didedsa12346"
 *                 city_name: "Dembi"
 *                 email_address: "amaedris1@gmail.com"
 *                 contact_phone_number: "+251987654321"
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



router.post("/create",checkPermission('can_create_sector'),createSectorValidation, create);
/**
 * @swagger
 * /structure/sector/get:
 *   get:
 *     summary: Query All Sectors 
 *     tags: [Sector]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/get",checkPermission('can_view_sector'), findAll);
/**
 * @swagger
 * /structure/sector/get/{sector_id}:
 *   get:
 *     summary: Query Sector by Sector Id
 *     tags: [Sector]
 *     parameters:
 *       - name: sector_id
 *         in: path
 *         required: true
 *         description: The ID of the sector
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
router.get("/get/:sector_id",checkPermission('can_view_sector'), findOne);
/**
 * @swagger
 * /structure/sector/delete/{sector_id}:
 *   delete:
 *     summary: Delete Sector by Id
 *     tags: [Sector]
 *     parameters:
 *       - name: sector_id
 *         in: path
 *         required: true
 *         description: The ID of the Sector
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
router.delete("/delete/:sector_id",checkPermission('can_delete_woreda_admin'), deleteOne);
/**
 * @swagger
 * /structure/sector/sectorname:
 *   get:
 *     summary: Query All Sector Name 
 *     tags: [Sector]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/sectorname",checkPermission('can_view_sector'), getSectorName)
/**
 * @swagger
 * /structure/sector/ownSector:
 *   get:
 *     summary: Query All Sectors 
 *     tags: [Sector]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/ownSector",checkPermission('can_view_sector'), findAllOwnSector);

module.exports = router;
