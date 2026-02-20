function validateOnboarding(data) {
  const requiredFields = [
    "age",
    "gender",
    "height",
    "weight",
    "goal",
    "experienceLevel",
    "workoutDaysPerWeek",
    "maxWorkoutDuration",
    "targetAreas",
    "equipmentAvailability",
    "dietPreference",
    "dailyFoodBudget"
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }

  if (data.workoutDaysPerWeek > 7) {
    return "workoutDaysPerWeek cannot exceed 7";
  }

  return null;
}

module.exports = { validateOnboarding };