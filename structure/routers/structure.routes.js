const express = require("express");
const router = express.Router();
const woreda = require("./woreda/index");
const zone =require("./zone/index")
const sector =require("./sector/index")
const group = require("./group/index")
const work = require("./work/index");
const organization = require("./organization/index")
// routing to woreda
router.use('/woreda',woreda);
// routing to zone
router.use("/zone", zone);
router.use("/sector",sector);
router.use("/group", group)
router.use("/work", work);
router.use("/organization", organization);
module.exports=router;