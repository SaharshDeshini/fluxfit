const admin = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Check if header exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 2️⃣ Extract token
  const token = authHeader.split(" ")[1];

  try {
    // 3️⃣ Verify token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 4️⃣ Attach user info to request
    req.user = decodedToken;

    next(); // move to next function
   } catch (error) {
  console.error("VERIFY ERROR FULL:", error);
  return res.status(401).json({
    message: error.message
  });
}
};

module.exports = verifyToken;