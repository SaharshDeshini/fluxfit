const { callAI } = require("../services/aiService");

exports.testAI = async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await callAI({
      systemPrompt: "You are a helpful assistant.",
      userPrompt: message,
      maxTokens: 50
    });

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};