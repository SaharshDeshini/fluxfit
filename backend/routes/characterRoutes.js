const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { characterMessage } = require("../controllers/characterController");

router.post("/message", authMiddleware, characterMessage);

module.exports = router;