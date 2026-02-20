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

exports.updateProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const updates = req.body;

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    let regenerateWorkout = false;
    let regenerateDiet = false;

    // Detect important changes
    if (updates.weight && updates.weight !== userData.weight) {
      regenerateDiet = true;
    }

    if (
      updates.workoutDaysPerWeek &&
      updates.workoutDaysPerWeek !== userData.workoutDaysPerWeek
    ) {
      regenerateWorkout = true;
    }

    if (
      updates.dietPreference &&
      updates.dietPreference !== userData.dietPreference
    ) {
      regenerateDiet = true;
    }

    // Update profile fields
    await userRef.update(updates);

    let newWorkoutPlan = null;
    let newDietPlan = null;

    // 🔥 Regenerate diet if needed
    if (regenerateDiet) {
      const updatedUser = { ...userData, ...updates };

      const bmr = calculateBMR(updatedUser);
      const calorieTarget = calculateCalorieTarget(bmr, updatedUser.goal);
      const macros = calculateMacros(
        calorieTarget,
        updatedUser.weight,
        updatedUser.goal
      );

      newDietPlan = generateDietPlan({
        calorieTarget,
        ...macros
      });

      await userRef
        .collection("diet")
        .doc("basePlan")
        .set(newDietPlan);

      await userRef
        .collection("diet")
        .doc("activePlan")
        .set(newDietPlan);
    }

    // 🔥 Regenerate workout if needed
    if (regenerateWorkout) {
      const updatedUser = { ...userData, ...updates };

      newWorkoutPlan = generateWorkoutPlan(updatedUser);

      const today = new Date().toISOString().split("T")[0];

      await userRef
        .collection("workoutPlans")
        .doc(today)
        .set(newWorkoutPlan);
    }

    return res.json({
      success: true,
      workoutRegenerated: regenerateWorkout,
      dietRegenerated: regenerateDiet
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};