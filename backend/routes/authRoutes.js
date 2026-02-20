const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { verifyUser } = require("../controllers/authController");

router.post("/verify", verifyToken, verifyUser);

module.exports = router;