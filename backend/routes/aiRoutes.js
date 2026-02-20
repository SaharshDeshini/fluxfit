const express = require("express");
const router = express.Router();
const { testAI } = require("../controllers/aiController");

router.post("/test", testAI);

module.exports = router;