const express = require("express");
const router = express.Router();
const { blockUser, reportUser } = require("../controllers/blockReport");

router.post("/block-user", blockUser);
router.post("/report-user", reportUser);

module.exports = router;
