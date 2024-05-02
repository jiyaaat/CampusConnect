const express = require("express");
const router = express.Router();
const { getMatches, swipe, notifications } = require("../controllers/matching");

router.get("/", getMatches);
router.post("/swipe", swipe);
router.get("/notifications", notifications);

module.exports = router;
