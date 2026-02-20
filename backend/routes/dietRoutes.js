const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getActiveDiet,
  queryDiet,
  confirmDiet,
  overrideDiet
} = require("../controllers/dietController");

router.get("/active", authMiddleware, getActiveDiet);
router.post("/query", authMiddleware, queryDiet);
router.post("/confirm", authMiddleware, confirmDiet);
router.post("/override", authMiddleware, overrideDiet);

module.exports = router;