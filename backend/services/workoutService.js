function generateWorkoutPlan(user) {
  const { workoutDaysPerWeek, maxWorkoutDuration } = user;

  let exercises = [];

  if (workoutDaysPerWeek <= 3) {
    exercises = [
      { name: "Push Ups", sets: 3, reps: 12, rest: 60 },
      { name: "Squats", sets: 3, reps: 15, rest: 60 },
      { name: "Plank", sets: 3, reps: 30, rest: 45 }
    ];
  } else {
    exercises = [
      { name: "Bench Press", sets: 4, reps: 10, rest: 90 },
      { name: "Deadlift", sets: 4, reps: 8, rest: 120 },
      { name: "Pull Ups", sets: 3, reps: 10, rest: 90 }
    ];
  }

  return {
    generatedAt: new Date(),
    recoveryIndexUsed: 75,
    loadMultiplier: 1,
    exercises,
    completed: false
  };
}

function adjustWorkoutPlan(workoutPlan, loadMultiplier) {
  const adjustedExercises = workoutPlan.exercises.map((ex) => {
    return {
      ...ex,
      sets: Math.max(1, Math.round(ex.sets * loadMultiplier)),
      reps: Math.max(1, Math.round(ex.reps * loadMultiplier)),
      rest: Math.max(20, Math.round(ex.rest / loadMultiplier))
    };
  });

  return {
    ...workoutPlan,
    loadMultiplier,
    exercises: adjustedExercises
  };
}

module.exports = {
  generateWorkoutPlan,
  adjustWorkoutPlan
};
