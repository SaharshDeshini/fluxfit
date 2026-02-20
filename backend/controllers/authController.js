const { admin, db } = require("../config/firebase");

exports.verifyUser = async (req, res) => {
  const { token } = req.body;

  try {
    // 1️⃣ Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name || "";

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    // 2️⃣ Check if user exists
    if (userDoc.exists) {
      return res.json({
        success: true,
        isNewUser: false,
        redirectTo: "dashboard",
      });
    }

    // 3️⃣ If not exists → create basic record
    await userRef.set({
      email,
      name,
      createdAt: new Date(),
      profileCompleted: false,
    });

    return res.json({
      success: true,
      isNewUser: true,
      redirectTo: "questionnaire",
    });

  } catch (error) {
  console.log("VERIFY ERROR:", error);
  res.status(401).json({
    success: false,
    message: error.message
  });
  }
};