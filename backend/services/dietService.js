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

const { callAI } = require("./aiService");
const mealOptions = require("../data/mealOptions.json");

async function generateDietSuggestion(activePlan, queryText) {
 const systemPrompt = `
You are a strict diet selection engine.

Rules:
- Respond ONLY with raw JSON.
- No markdown.
- No explanation.
- No extra fields.
- Use ONLY meal names from provided options.
- Select MAXIMUM 2 items per category.
- Select items relevant to the user's request.
- Do NOT select all options.
- Return structure exactly:

{
  "breakfast": [],
  "lunch": [],
  "dinner": [],
  "snacks": []
}
`;

  const userPrompt = `
User request: ${queryText}

Allowed meal options:
${JSON.stringify(mealOptions)}
`;

  const aiResponse = await callAI({
    systemPrompt,
    userPrompt,
    maxTokens: 150,      // 🔥 reduce to avoid truncation
  });

  try {
    // 🔥 Remove markdown if present
    let cleaned = aiResponse.replace(/```json/g, "")
                            .replace(/```/g, "")
                            .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    
const finalPlan = {
  breakfast: parsed.breakfast?.slice(0, 1) || [],
  lunch: parsed.lunch?.slice(0, 1) || [],
  dinner: parsed.dinner?.slice(0, 1) || [],
  snacks: parsed.snacks?.slice(0, 1) || []
};

return finalPlan;

  } catch (err) {
    console.error("AI RAW RESPONSE:", aiResponse);
    throw new Error("AI returned invalid JSON");
  }
}

module.exports = {
  generateDietPlan,
  generateDietSuggestion
};
