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
 *     summary: Create a new Sector
 *     tags: [Sector]
 *     requestBody:
 *       description: Request body for creating a Sector
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sector_name:
 *                 type: string
 *                 description: Name of the sector
 *                 example: "HR"
 *                 required: true
 *               email_address:
 *                 type: string
 *                 description: Email address of the sector
 *                 example: "sector_hr@gmail.com"
 *               phone_number:
 *                 type: string
 *                 description: Contact phone number of the sector
 *                 example: "+251987654321"
 *               address:
 *                 type: string
 *                 description: Physical address of the sector
 *                 example: "Addis Abeba"
 *               parent_sector_id:
 *                 type: string
 *                 description: UUID of the parent sector (if applicable)
 *                 format: uuid
 *                 example: "a3d0b8c2-e55b-47f5-8b6e-05b54cc546c3"
 *     responses:
 *       200:
 *         description: Successfully created the sector
 *         content:
 *           application/json:
 *             example:
 *               message: "Sector successfully created."
 *               sector:
 *                 id: "5f8d0d55b54764421b7156f9"
 *                 sector_name: "HR"
 *                 email_address: "sector_hr@gmail.com"
 *                 phone_number: "+251987654321"
 *                 address: "Addis Abeba"
 *                 parent_sector_id: "a3d0b8c2-e55b-47f5-8b6e-05b54cc546c3"
 *       400:
 *         description: Invalid request due to validation errors
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid data: sector_name is required."
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
router.get("/get/all",checkPermission('can_view_sector'), findAll);
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
