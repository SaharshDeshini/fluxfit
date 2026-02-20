const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createPost,
  getPosts
} = require("../controllers/communityController");

router.post("/create", authMiddleware, createPost);
router.get("/posts", authMiddleware, getPosts);

module.exports = router;