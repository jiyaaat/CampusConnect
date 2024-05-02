const express = require("express");
const router = express.Router();
const { sendVerify, checkVerify } = require("../controllers/verification");

router.post("/sendverify", sendVerify);
router.post("/checkverify", checkVerify);

module.exports = router;
