const express = require("express");
const router = express.Router();
const { getSuggestions, search } = require("../controllers/suggestions");

router.get("/", getSuggestions);
router.get("/search", search);

module.exports = router;
