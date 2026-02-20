const admin = require("firebase-admin");
const { generateCharacterMessage } = require("../services/characterService");

const db = admin.firestore();

exports.characterMessage = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { exerciseName, repNumber, formScore, fatigueLevel } = req.body;

    if (!exerciseName || repNumber == null || formScore == null || fatigueLevel == null) {
      return res.status(400).json({ error: "All fields required" });
    }

    const aiMessage = await generateCharacterMessage({
      exerciseName,
      repNumber,
      formScore,
      fatigueLevel
    });

    const today = new Date().toISOString().split("T")[0];

    await db
      .collection("users")
      .doc(uid)
      .collection("characterLogs")
      .add({
        exerciseName,
        repNumber,
        formScore,
        fatigueLevel,
        aiMessage,
        timestamp: new Date()
      });

    return res.json({ aiMessage });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};