function calculateFatigueIncrease(exercises) {
  let totalVolume = 0;
  let lowFormPenalty = 0;

  exercises.forEach((ex) => {
    totalVolume += ex.totalReps;

    if (ex.avgFormScore < 0.6) {
      lowFormPenalty += 5;
    }
  });

  const volumeFactor = totalVolume / 50;

  return Math.round(volumeFactor + lowFormPenalty);
}

function updateStreak(previousStreak, workoutCompleted) {
  if (workoutCompleted) {
    return previousStreak + 1;
  }
  return previousStreak;
}

function shouldResetWeek(weeklyWorkoutCount, workoutDaysPerWeek) {
  return weeklyWorkoutCount >= workoutDaysPerWeek;
}

module.exports = {
  calculateFatigueIncrease,
  updateStreak,
  shouldResetWeek
};