const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  update,
  deleteOne,
  getSectorName
} = require("../../controllers/sector/sector.controller");
const {
createSectorValidation
} = require("../../validation/sector/sector.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
/**
 * @swagger
 * /structure/sector/create:
 *   post:
 *     summary: Create new Sector
 *     tags: [Sector]
 *     requestBody:
 *       description: Request body for creating Sector
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sector_name:
 *                 type: string
 *               sector_type:
 *                 type: string
 *               woreda_id:
 *                 type: string
 *               parent_sector_id:
 *                 type: string
 *             example:
 *                sector_name: "Communication Dides"
 *                sector_type: "Woreda"
 *                woreda_id: "ff3445f7-61f6-4c1c-aa46-c98d882c85b8"
 *                parent_sector_id: "68e5796e-d160-4f4f-b799-1bdb1c2d7348"
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
router.get("/sectorname", getSectorName)

module.exports = router;
