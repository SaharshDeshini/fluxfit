const admin = require("firebase-admin");
const db = admin.firestore();

exports.logMeditation = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { durationInSeconds } = req.body;

    if (!durationInSeconds || durationInSeconds <= 0) {
      return res.status(400).json({
        error: "Valid durationInSeconds required"
      });
    }

    const today = new Date().toISOString().split("T")[0];

    const docRef = db
      .collection("users")
      .doc(uid)
      .collection("wellnessLogs")
      .doc(today);

    const snap = await docRef.get();

    let totalMeditationToday = durationInSeconds;

    if (snap.exists) {
      const existing = snap.data();
      totalMeditationToday =
        (existing.meditationDuration || 0) + durationInSeconds;
    }

    await docRef.set({
      meditationDuration: totalMeditationToday,
      date: today
    });

    return res.json({
      success: true,
      totalMeditationToday
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};