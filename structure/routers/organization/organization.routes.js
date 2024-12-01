const router = require("express").Router();
const {checkPermission} = require("../../../middlewares/accessControl")
const {getOrganizationStructure} = require("../../controllers/organization/organization.controller")
// In your routes file
router.get('/organization-structure', checkPermission('can_view_organization'), getOrganizationStructure);
router.get("/:woreda_id",checkPermission('can_view_organization'),getOrganizationStructure);
module.exports = router;