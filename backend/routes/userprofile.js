const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  checkProfile,
} = require("../controllers/userProfile");

router.get("/profile", getUserProfile);
router.post("/update", updateUserProfile);
router.get("/check", checkProfile);

module.exports = router;
