const express = require("express");
const router = express.Router();
const { onboarding } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/onboarding", authMiddleware, onboarding);

module.exports = router;