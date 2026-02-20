const admin = require("firebase-admin");
const {
  generateDietSuggestion
} = require("../services/dietService");

const db = admin.firestore();

exports.getActiveDiet = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("users")
      .doc(uid)
      .collection("diet")
      .doc("activePlan")
      .get();

    if (!snap.exists) {
      return res.status(404).json({ error: "No active diet" });
    }

    res.json(snap.data());

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.queryDiet = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { queryText } = req.body;

    if (!queryText) {
      return res.status(400).json({ error: "queryText required" });
    }

    const activeSnap = await db
      .collection("users")
      .doc(uid)
      .collection("diet")
      .doc("activePlan")
      .get();

    const activePlan = activeSnap.data();

    const suggestedPlan = await generateDietSuggestion(
      activePlan,
      queryText
    );

    res.json({ suggestedPlan });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.confirmDiet = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { newPlan } = req.body;

    if (!newPlan) {
      return res.status(400).json({ error: "newPlan required" });
    }

    await db
      .collection("users")
      .doc(uid)
      .collection("diet")
      .doc("activePlan")
      .set(newPlan);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.overrideDiet = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { overrideType } = req.body;

    if (!overrideType) {
      return res.status(400).json({ error: "overrideType is required" });
    }

    const today = new Date().toISOString().split("T")[0];

    let extraCaloriesAllowed = 0;

    if (overrideType === "cheat") {
      extraCaloriesAllowed = 500;
    } else if (overrideType === "skip") {
      extraCaloriesAllowed = 0;
    }

    await db
      .collection("users")
      .doc(uid)
      .collection("diet")
      .doc(`dailyOverride_${today}`)
      .set({
        overrideType,
        extraCaloriesAllowed,
        date: today
      });

    return res.json({
      success: true,
      extraCaloriesAllowed
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};