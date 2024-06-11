const express = require("express");
const router = express.Router();
const woreda = require("./woreda/index");
const zone =require("./zone/index")
const sector =require("./sector/index")
// routing to woreda
router.use('/woreda',woreda);
// routing to zone
router.use("/zone", zone);
router.use("/sector",sector);
module.exports=router;