import { format } from 'date-fns';

export const generateProgramPromptString = (userInfo) => {
  if (!userInfo) return null;

  const formattedDate = format(new Date(), 'yyyy-MM-dd');

  // Helper to create the schedule list based on daysPerWeek preference
  const defaultDays = ["Monday", "Wednesday", "Friday", "Tuesday", "Thursday", "Saturday", "Sunday"];
  const scheduledDays = defaultDays.slice(0, userInfo.daysPerWeek).join(', ');

  const gymAccessStr = userInfo.gymAccess ? "Yes (Machines and Weights available)" : "No (Bodyweight or limited equipment only)";
  const heightStr = `${userInfo.height} ${userInfo.heightUnit}`;
  const weightStr = `${userInfo.weight} ${userInfo.weightUnit}`;

  return `
          You will now create a highly personalized 2-week fitness program. The structure of a fitness program is as follows:
          - **Program**: Contains routines.
          - **Routine**: Each routine is a set of exercises.
          - **Exercise**: A specific movement that includes repetitions and sets.

          ### Database Schema
          The program should adhere to the following database schema:
          - **Program**
          - **Program_Routine** (Many to Many relationship between Program and Routine)
          - **Routine**
          - **Routine_Exercise** (Many to Many relationship between Routine and Exercise)

          ### User Profile (Crucial for Personalization)
          Please use the following precise details from the user's fitness onboarding questionnaire to customize every aspect of the workout plan:
          - Physical Stats: ${userInfo.gender}, Age ${userInfo.age}, Height ${heightStr}, Weight ${weightStr}
          - Primary Fitness Goal: ${userInfo.goal}
          - Experience Level: ${userInfo.level} 
          - Availability: ${userInfo.daysPerWeek} days per week (${scheduledDays})
          - Max Workout Duration: ${userInfo.duration} minutes per session
          - Target Focus: ${userInfo.targetMuscleGroup}
          - Gym Equipment Access: ${gymAccessStr}

          ### Output Requirements
          Generate the output in the following JavaScript JSON object format.
          Ensure each field adheres to the specified requirements, as shown below:

          \`\`\`json
          {
            "program": {
              "id": "<uuid>",
              "duration": <number>,
              "name": "<string>",
              "description": "<string>",
              "goal_id": "<number>"
            },
            "program_routine": [
              {
                "program_id": "<uuid>",
                "routine_id": "<uuid>",
                "scheduled_date": "<date>",
                "completed": "FALSE"
              }
            ],
            "routine": [
              {
                "id": "<uuid>",
                "program_id": "<uuid>",
                "name": "<string>",
                "description": "<string>",
                "duration": <number>,
                "preset": "FALSE",
                "estimated_calories": <number>,
                "completed": "FALSE"
              }
            ], 
            "routine_exercise": [
              {
                "routine_id": "<uuid>",
                "exercise_id": "<uuid>",
                "sets": <number>,
                "reps": <number>,
                "order": <number>,
                "rest_time": <number>
              }
            ] 
          }
          \`\`\`

          ### Predefined Exercises
          Use only the following exercises to create the routines. Do not use any exercise IDs other than the ones provided below:
          - UUID: fb7180ab-f3e2-4a5d-b731-a2c0fc5de9fa (Exercise: Bodyweight Squat)
          - UUID: 0cc22f75-7d4d-4d50-9cdd-4ae3c731c517 (Exercise: Jumping jacks)
          - UUID: 7c12ed44-7dac-4b42-90c3-aa9a02dd251d (Exercise: Plank)
          - UUID: 25e807c9-1a7b-440b-ab02-17b1b99d1430 (Exercise: Sit ups)
          - UUID: ed999b28-ae50-4009-b29c-c7f6a28857c9 (Exercise: Close hands pushup)

          ### Additional Notes
          - **Today's Date**: ${formattedDate}.
          - **Routine Scheduling**: Schedule routines only on the days specified by the user as available for workouts (e.g., Monday, Wednesday, Friday). Do not assign routines on any other days, and ensure that no routines are scheduled for dates in the past.
          - **First Routine Schedule**: The first routine should be scheduled on ${formattedDate} for demo purposes.
          - **Program Duration**: The program should span 2 weeks from today's date.
          - **Return Format**: Exclude any backticks when you return the object.
          - **UUID format should be xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, and it must be a valid UUID containing only hexadecimal characters (0-9 and a-f).**
          `;
};
