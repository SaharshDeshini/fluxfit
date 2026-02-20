function generateDietPlan({ calorieTarget, protein, carbs, fat }) {
  return {
    calorieTarget,
    proteinTarget: protein,
    carbTarget: carbs,
    fatTarget: fat,
    breakfast: [{ name: "Oats", imageUrl: "" }],
    lunch: [{ name: "Rice & Chicken", imageUrl: "" }],
    dinner: [{ name: "Paneer & Roti", imageUrl: "" }],
    snacks: [{ name: "Nuts", imageUrl: "" }]
  };
}

module.exports = { generateDietPlan };