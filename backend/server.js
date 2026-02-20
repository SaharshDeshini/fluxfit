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

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});