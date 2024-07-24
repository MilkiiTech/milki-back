const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  deleteOne,
  assignWorkToSector,
  getWorkByUserId,
pickWork,
createWeaklyTask,
getWeeklyTask
} = require("../../controllers/work/work.controller");
const {
createWorkValidation
} = require("../../validation/work/work.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
/**
 * @swagger
 * /structure/work/create:
 *   post:
 *     summary: Create new Work
 *     tags: [Work]
 *     requestBody:
 *       description: Request body for creating new work
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               assignedBy:
 *                 type: integer
 *               sectorId:
 *                 type: integer
 *               plannedStartDate:
 *                 type: string
 *                 format: date
 *               plannedEndDate:
 *                 type: string
 *                 format: date
 *               quality:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               timeRequired:
 *                 type: integer
 *               cost:
 *                 type: number
 *                 format: double
 *             example:
 *               description: "New work description"
 *               assignedBy: 1
 *               sectorId: 1
 *               plannedStartDate: "2024-07-01"
 *               plannedEndDate: "2024-07-31"
 *               quality: "High"
 *               quantity: 100
 *               timeRequired: 40
 *               cost: 2000.00
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: "Work created successfully"
 *       400:
 *         description: Invalid request
 */



router.post("/create",checkPermission('can_create_work'),createWorkValidation, create);
/**
 * @swagger
 * /structure/work/get:
 *   get:
 *     summary: Query All Work 
 *     tags: [Work]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/get", checkPermission('can_view_zone_admin'), findAll);
/**
 * @swagger
 * /structure/work/get/{workId}:
 *   get:
 *     summary: Fetch Work by workId
 *     tags: [Work]
 *     parameters:
 *       - name: workId
 *         in: path
 *         required: true
 *         description: The ID of the work
 *         schema:
 *           type: string
 *         example:
 *             a5166002-89bb-4a3c-a34a-39b44d33c212
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               work: {}
 */
router.get("/get/:workId", checkPermission('can_view_work'), findOne);
/**
 * @swagger
 * /structure/work/{workId}:
 *   delete:
 *     summary: Delete Work by workId
 *     tags: [Work]
 *     parameters:
 *       - name: workId
 *         in: path
 *         required: true
 *         description: The ID of the work
 *         schema:
 *           type: string
 *         example:
 *             a5166002-89bb-4a3c-a34a-39b44d33c212
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               work: {}
 */
router.delete("/:workId", checkPermission('can_delete_zone_admin'), deleteOne);
/**
 * @swagger
 * /structure/work/assign/{workId}:
 *   post:
 *     summary: Assign Work to WorkId
 *     tags: [Work]
 *     parameters:
 *       - name: workId
 *         in: path
 *         required: true
 *         description: The ID of the work
 *         schema:
 *           type: string
 *         example: a5166002-89bb-4a3c-a34a-39b44d33c212
 *     requestBody:
 *       description: Request body for assigning work to sectors
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sector_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               sector_ids:
 *                 - "5725a78a-98cf-4da8-96ab-cc72a5b5af0a"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: "Work assigned successfully"
 *       400:
 *         description: Invalid request
 */

router.post("/assign/:workId", checkPermission("can_update_work"),assignWorkToSector);

router.get("/getByUserId", checkPermission("can_view_work"),getWorkByUserId)
router.post("/pickWork", checkPermission("can_update_work"),pickWork)

router.post("/weaklyTask/create", checkPermission("can_update_work"),createWeaklyTask);
router.get("/weaklyTask/get/:workId", checkPermission("can_update_work"),getWeeklyTask);
module.exports = router;
