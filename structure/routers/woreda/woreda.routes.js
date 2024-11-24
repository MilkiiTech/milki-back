const express = require("express");
const router = express.Router();
const {
  create,
  findAll,
  findOne,
  deleteOne,
  findWoredaSectors
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
 *               message: "Woreda created successfully"
 *       400:
 *         description: Invalid request
 */



router.post("/create",checkPermission('can_create_woreda'),createWoredaValidation, create);
/**
 * @swagger
 * /structure/woreda/get:
 *   get:
 *     summary: Query All Woreda 
 *     tags: [Woreda]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               role: {}
 */
router.get("/get",checkPermission('can_view_woreda'), findAll);
router.get("/get/sector/:woreda_id",checkPermission('can_view_woreda'), findWoredaSectors);

/**
 * @swagger
 * /structure/woreda/get/{woreda_id}:
 *   get:
 *     summary: Get Woreda by woreda Id
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
router.get("/get/:woreda_id",checkPermission('can_view_woreda'), findOne);
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
router.delete("/delete/:woreda_id",checkPermission('can_delete_woreda'), deleteOne);

module.exports = router;
