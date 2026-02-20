const { db } = require("../config/firebase");

exports.verifyUser = async (req, res) => {
  try {
    // 🔥 Token already verified by middleware
    const uid = req.user.uid;
    const email = req.user.email || "";
    const name = req.user.name || "";

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.json({
        success: true,
        isNewUser: false,
        redirectTo: "dashboard"
      });
    }

    // Create new user record
    await userRef.set({
      email,
      name,
      createdAt: new Date(),
      profileCompleted: false,
    });

    return res.json({
      success: true,
      isNewUser: true,
      redirectTo: "questionnaire"
    });

  } catch (error) {
    console.error("VERIFY CONTROLLER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};