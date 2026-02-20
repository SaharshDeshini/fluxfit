function calculateBMR({ gender, weight, height, age }) {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

function calculateCalorieTarget(bmr, goal) {
  const multipliers = {
    fat_loss: 0.8,
    muscle_gain: 1.15,
    maintain: 1
  };

  return Math.round(bmr * multipliers[goal]);
}

function calculateMacros(calories, weight, goal) {
  let proteinPerKg = 1.4;

  if (goal === "muscle_gain") proteinPerKg = 2;
  if (goal === "fat_loss") proteinPerKg = 1.6;

  const protein = Math.round(weight * proteinPerKg);
  const fat = Math.round((calories * 0.25) / 9);
  const remainingCalories = calories - (protein * 4 + fat * 9);
  const carbs = Math.round(remainingCalories / 4);

  return { protein, fat, carbs };
}

function calculateRecoveryIndex({ sleep, stress, soreness, energy }) {
  let recovery =
    (sleep * 0.3 +
      energy * 0.3 -
      stress * 0.2 -
      soreness * 0.2) *
    20;

  recovery = Math.max(0, Math.min(100, Math.round(recovery)));

  return recovery;
}

function getLoadMultiplier(recoveryIndex) {
  if (recoveryIndex >= 80) return 1.1;
  if (recoveryIndex >= 60) return 1.0;
  if (recoveryIndex >= 40) return 0.85;
  return 0.7;
}

module.exports = {
  calculateBMR,
  calculateCalorieTarget,
  calculateMacros,
  calculateRecoveryIndex,
  getLoadMultiplier
};
