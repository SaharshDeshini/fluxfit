const admin = require("firebase-admin");
const { validateOnboarding } = require("../utils/validators");
const {
  calculateBMR,
  calculateCalorieTarget,
  calculateMacros
} = require("../services/aceService");
const { generateWorkoutPlan } = require("../services/workoutService");
const { generateDietPlan } = require("../services/dietService");

const db = admin.firestore();

exports.onboarding = async (req, res) => {
  try {
    const uid = req.user.uid;
    const data = req.body;

    const error = validateOnboarding(data);
    if (error) return res.status(400).json({ error });

    const bmr = calculateBMR(data);
    const calorieTarget = calculateCalorieTarget(bmr, data.goal);
    const macros = calculateMacros(calorieTarget, data.weight, data.goal);

    const workoutPlan = generateWorkoutPlan(data);
    const dietPlan = generateDietPlan({
      calorieTarget,
      ...macros
    });

    await db.collection("users").doc(uid).set({
      ...data,
      profileCompleted: true,
      currentRecoveryIndex: 75,
      currentLoadMultiplier: 1,
      currentFatigueScore: 0,
      streakCount: 0,
      weeklyWorkoutCount: 0,
      weekStartDate: new Date()
    });

    const today = new Date().toISOString().split("T")[0];

    await db
      .collection("users")
      .doc(uid)
      .collection("workoutPlans")
      .doc(today)
      .set(workoutPlan);

    await db
      .collection("users")
      .doc(uid)
      .collection("diet")
      .doc("basePlan")
      .set(dietPlan);

    await db
      .collection("users")
      .doc(uid)
      .collection("diet")
      .doc("activePlan")
      .set(dietPlan);

    return res.json({
      success: true,
      profileCompleted: true,
      initialWorkoutPlan: workoutPlan,
      baseDietPlan: dietPlan
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};