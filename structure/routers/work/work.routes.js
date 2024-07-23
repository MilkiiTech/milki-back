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
 *                   role_id:
 *                     type: integer
 *             example:
 *               users:
 *                 - username: "moti"
 *                   email: "moti@gmail.com"
 *                   phone_number: "+251985654322"
 *                   sector_name: "HR"
 *                   role_id: 6
 *                 - username: "etana"
 *                   email: "etana@gmail.com"
 *                   phone_number: "+251987667322"
 *                   sector_name: "BULCHA"
 *                   role_id: 6
 *               zoneDetail:
 *                 zone_name: "Ilu A/BORA"
 *                 city_name: "Metu"
 *                 email_address: "amaedris1@gmail.com"
 *                 contact_phone_number: "+251987654321"
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


router.post("/create",checkPermission('can_create_work'),createWorkValidation, create);
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
router.get("/get", checkPermission('can_view_zone_admin'), findAll);
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
router.get("/get/:workId", checkPermission('can_view_work'), findOne);
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
router.delete("/:zone_user_id", checkPermission('can_delete_zone_admin'), deleteOne);

router.post("/assign/:workId", checkPermission("can_update_work"),assignWorkToSector);

router.get("/getByUserId", checkPermission("can_view_work"),getWorkByUserId)
router.post("/pickWork", checkPermission("can_update_work"),pickWork)

router.post("/weaklyTask/create", checkPermission("can_update_work"),createWeaklyTask);
router.get("/weaklyTask/get/:workId", checkPermission("can_update_work"),getWeeklyTask);
module.exports = router;
