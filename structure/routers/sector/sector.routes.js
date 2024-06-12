const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  update,
  deleteOne
} = require("../../controllers/sector/sector.controller");
const {
createSectorValidation
} = require("../../validation/sector/sector.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
/**
 * @swagger
 * /structure/sector/create:
 *   post:
 *     summary: Create new  User 
 *     tags: [Sector]
 *     requestBody:
 *       description: Request body for creating Sector
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
 *   post:
 *     summary: Assign Role to User
 *     tags: [Sector]
 *     parameters:
 *       - name: sector_id
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
router.get("/get/:sector_id",checkPermission('can_view_sector'), findOne);
/**
 * @swagger
 * /structure/sector/delete/{sector_id}:
 *   delete:
 *     summary: Delete Woreda by Id
 *     tags: [Sector]
 *     parameters:
 *       - name: sector_id
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
router.delete("/delete/:sector_id",checkPermission('can_delete_woreda_admin'), deleteOne);

module.exports = router;
