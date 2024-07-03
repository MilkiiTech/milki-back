const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  deleteOne
} = require("../../controllers/woreda/woreda.controller");
const {
createWoredaValidation
} = require("../../validation/woreda/woreda.validation");
const { checkPermission } = require("../../../middlewares/accessControl");
/**
 * @swagger
 * /structure/woreda/create:
 *   post:
 *     summary: Create new Woreda
 *     tags: [Woreda]
 *     requestBody:
 *       description: Request body for creating a new woreda
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userDetail:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone_number:
 *                     type: string
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
 *               role_id:
 *                 type: integer
 *               zone_id:
 *                 type: string
 *             example:
 *               userDetail: 
 *                 username: "dides_admin"
 *                 email: "amaedris1@gmail.com"
 *                 phone_number: "+251987654321"
 *               woredaDetail:
 *                 woreda_name: "Didesa"
 *                 city_name: "Dembi"
 *                 email_address: "amaedris1@gmail.com"
 *                 contact_phone_number: "+251987654321"
 *               role_id: 7
 *               zone_id: "039e77e3-2134-4d89-bd92-68ded5b6197d"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: "Woreda created successfully"
 *       400:
 *         description: Invalid request
 */

router.post("/create",checkPermission('can_create_woreda_admin'),createWoredaValidation, create);
/**
 * @swagger
 * /structure/woreda/get:
 *   get:
 *     summary: Query All Permissions 
 *     tags: [Woreda]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/get",checkPermission('can_view_woreda_admin'), findAll);
/**
 * @swagger
 * /structure/woreda/get/{woreda_id}:
 *   post:
 *     summary: Assign Role to User
 *     tags: [Woreda]
 *     parameters:
 *       - name: woreda_id
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
router.get("/get/:woreda_id",checkPermission('can_view_woreda_admin'), findOne);
/**
 * @swagger
 * /structure/woreda/delete/{woreda_id}:
 *   delete:
 *     summary: Delete Woreda by Id
 *     tags: [Woreda]
 *     parameters:
 *       - name: woreda_id
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
router.delete("/delete/:woreda_id",checkPermission('can_delete_woreda_admin'), deleteOne);

module.exports = router;
