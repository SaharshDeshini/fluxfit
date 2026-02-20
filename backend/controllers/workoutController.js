const admin = require("firebase-admin");
const {
  calculateRecoveryIndex,
  getLoadMultiplier
} = require("../services/aceService");
const { adjustWorkoutPlan } = require("../services/workoutService");

const db = admin.firestore();

exports.dailyCheckin = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { sleep, stress, soreness, energy } = req.body;

    if (
      sleep == null ||
      stress == null ||
      soreness == null ||
      energy == null
    ) {
      return res.status(400).json({ error: "All fields required" });
    }

    const recoveryIndex = calculateRecoveryIndex({
      sleep,
      stress,
      soreness,
      energy
    });

    const loadMultiplier = getLoadMultiplier(recoveryIndex);

    const today = new Date().toISOString().split("T")[0];

    // Store daily log
    await db
      .collection("users")
      .doc(uid)
      .collection("dailyLogs")
      .doc(today)
      .set({
        sleep,
        stress,
        soreness,
        energy,
        recoveryIndex,
        workoutCompleted: false,
        dietFollowed: false,
        cheatDay: false
      });

    // Fetch today's workout
    const workoutRef = db
      .collection("users")
      .doc(uid)
      .collection("workoutPlans")
      .doc(today);

    const workoutSnap = await workoutRef.get();

    if (!workoutSnap.exists) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    const workoutPlan = workoutSnap.data();

    const updatedWorkout = adjustWorkoutPlan(
      workoutPlan,
      loadMultiplier
    );

    await workoutRef.set(updatedWorkout);

    // Update user recovery state
    await db.collection("users").doc(uid).update({
      currentRecoveryIndex: recoveryIndex,
      currentLoadMultiplier: loadMultiplier
    });

    return res.json({
      recoveryIndex,
      loadMultiplier,
      updatedWorkoutPlan: updatedWorkout
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const {
  calculateFatigueIncrease,
  updateStreak,
  shouldResetWeek
} = require("../services/analyticsService");

exports.completeWorkout = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { totalTime, exercises } = req.body;

    if (!totalTime || !exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const today = new Date().toISOString().split("T")[0];

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    // 1️⃣ Store workoutLogs
    await userRef
      .collection("workoutLogs")
      .doc(today)
      .set({
        totalTime,
        exercises
      });

    // 2️⃣ Create workoutHistory entry
    const totalReps = exercises.reduce(
      (sum, ex) => sum + ex.totalReps,
      0
    );

    const averageFormScore =
      exercises.reduce((sum, ex) => sum + ex.avgFormScore, 0) /
      exercises.length;

    const caloriesBurned = Math.round(totalTime * 5);

    await userRef
      .collection("workoutHistory")
      .doc(today)
      .set({
        date: today,
        totalTime,
        totalExercises: exercises.length,
        totalReps,
        averageFormScore,
        caloriesBurned,
        completionStatus: true
      });

    // 3️⃣ Fatigue calculation
    const fatigueIncrease = calculateFatigueIncrease(exercises);
    const newFatigueScore =
      (userData.currentFatigueScore || 0) + fatigueIncrease;

    // 4️⃣ Update streak + weekly counter
    const newStreak = updateStreak(
      userData.streakCount || 0,
      true
    );

    const newWeeklyCount =
      (userData.weeklyWorkoutCount || 0) + 1;

    let resetWeek = false;
    let updatedWeeklyCount = newWeeklyCount;

    if (
      shouldResetWeek(
        newWeeklyCount,
        userData.workoutDaysPerWeek
      )
    ) {
      resetWeek = true;
      updatedWeeklyCount = 0;
    }

    // 5️⃣ Update user document
    await userRef.update({
      currentFatigueScore: newFatigueScore,
      streakCount: newStreak,
      weeklyWorkoutCount: updatedWeeklyCount
    });

    // 6️⃣ Mark dailyLog workoutCompleted = true
    await userRef
      .collection("dailyLogs")
      .doc(today)
      .update({
        workoutCompleted: true
      });

    // 7️⃣ Mark workoutPlan completed
    await userRef
      .collection("workoutPlans")
      .doc(today)
      .update({
        completed: true
      });

    return res.json({
      success: true,
      newFatigueScore,
      streakCount: newStreak,
      weeklyResetTriggered: resetWeek
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTodayWorkout = async (req, res) => {
  try {
    const uid = req.user.uid;
    const today = new Date().toISOString().split("T")[0];

    const workoutSnap = await db
      .collection("users")
      .doc(uid)
      .collection("workoutPlans")
      .doc(today)
      .get();

    if (!workoutSnap.exists) {
      return res.status(404).json({ error: "No workout for today" });
    }

    const workoutData = workoutSnap.data();

    return res.json({
      date: today,
      recoveryIndexUsed: workoutData.recoveryIndexUsed,
      loadMultiplier: workoutData.loadMultiplier,
      exercises: workoutData.exercises,
      completed: workoutData.completed || false
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getWorkoutHistory = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snapshot = await db
      .collection("users")
      .doc(uid)
      .collection("workoutHistory")
      .orderBy("date", "desc")
      .limit(30)
      .get();

    const history = [];

    snapshot.forEach((doc) => {
      history.push(doc.data());
    });

    return res.json(history);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};