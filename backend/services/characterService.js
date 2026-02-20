const { callAI } = require("./aiService");

async function generateCharacterMessage({
  exerciseName,
  repNumber,
  formScore,
  fatigueLevel
}) {

  const systemPrompt = `
You are an energetic fitness coach.

Rules:
- Reply in ONE short sentence.
- Maximum 12 words.
- Motivational tone.
- No emojis.
- No markdown.
- No extra text.
`;

  const userPrompt = `
Exercise: ${exerciseName}
Reps: ${repNumber}
Form Score: ${formScore}
Fatigue Level: ${fatigueLevel}

Give short motivational feedback.
`;

  const aiResponse = await callAI({
    systemPrompt,
    userPrompt,
    maxTokens: 30
  });

  return aiResponse;
}

module.exports = {
  generateCharacterMessage
};