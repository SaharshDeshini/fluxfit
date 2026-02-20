const axios = require("axios");
const { OPENROUTER_URL } = require("../config/aiConfig");

async function callAI({ systemPrompt, userPrompt, maxTokens = 100 }) {
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "mistralai/mistral-7b-instruct", // free model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "FluxFit"
        }
      }
    );

    return response.data.choices[0].message.content.trim();

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    throw new Error("AI request failed");
  }
}

module.exports = { callAI };