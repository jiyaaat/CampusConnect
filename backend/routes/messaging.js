const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/messaging");

router.get("/", getMessages);
router.post("/send", sendMessage);

module.exports = router;
