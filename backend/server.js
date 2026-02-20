const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// User routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

// Workout routes
const workoutRoutes = require("./routes/workoutRoutes");
app.use("/api/workout", workoutRoutes);

// Diet routes
const dietRoutes = require("./routes/dietRoutes");
app.use("/api/diet", dietRoutes);

// Character routes
const characterRoutes = require("./routes/characterRoutes");
app.use("/api/character", characterRoutes);

// Wellness routes
const wellnessRoutes = require("./routes/wellnessRoutes");
app.use("/api/wellness", wellnessRoutes);

// Community routes
const communityRoutes = require("./routes/communityRoutes");
app.use("/api/community", communityRoutes);

// Start server
const PORT = process.env.PORT || 5000;

// const aiRoutes = require("./routes/aiRoutes");
// app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});