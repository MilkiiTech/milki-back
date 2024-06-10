const express = require("express");
const router = express.Router();
const woreda = require("./woreda/index");
const zone =require("./zone/index")
// routing to woreda
router.use('/woreda',woreda);
// routing to zone
router.use("/zone", zone);
module.exports=router;