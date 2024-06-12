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
 *     summary: Create new  User 
 *     tags: [Woreda]
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
