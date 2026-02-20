const express = require("express");
const router = express.Router();
const { dailyCheckin } = require("../controllers/workoutController");
const authMiddleware = require("../middleware/authMiddleware");
const { completeWorkout } = require("../controllers/workoutController");
const {
  getTodayWorkout,
  getWorkoutHistory
} = require("../controllers/workoutController");

router.get("/today", authMiddleware, getTodayWorkout);
router.get("/history", authMiddleware, getWorkoutHistory);

router.post("/complete", authMiddleware, completeWorkout);
router.post("/daily-checkin", authMiddleware, dailyCheckin);

module.exports = router;