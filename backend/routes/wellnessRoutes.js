const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { logMeditation } = require("../controllers/wellnessController");

router.post("/meditation", authMiddleware, logMeditation);

module.exports = router;