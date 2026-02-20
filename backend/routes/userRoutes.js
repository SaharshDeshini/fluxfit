const express = require("express");
const router = express.Router();
const { onboarding } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { updateProfile } = require("../controllers/userController");

router.put("/update", authMiddleware, updateProfile);
router.post("/onboarding", authMiddleware, onboarding);

module.exports = router;