import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";
import {
  FaBell,
  FaPlay,
  FaHome,
  FaDumbbell,
  FaUtensils,
  FaUser,
} from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState(null);
  const [diet, setDiet] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("fluxfit_token");

        if (!token) {
          navigate("/");
          return;
        }

        // GET TODAY WORKOUT
        const workoutRes = await fetch(
          "https://fluxfit.onrender.com/api/workout/today",
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );

        if (!workoutRes.ok) throw new Error("Workout fetch failed");

        const workoutData = await workoutRes.json();

        // GET ACTIVE DIET
        const dietRes = await fetch(
          "https://fluxfit.onrender.com/api/diet/active",
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );

        if (!dietRes.ok) throw new Error("Diet fetch failed");

        const dietData = await dietRes.json();

        // GET WORKOUT HISTORY
        const historyRes = await fetch(
          "https://fluxfit.onrender.com/api/workout/history",
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );

        let historyData = [];
        if (historyRes.ok) {
          historyData = await historyRes.json();
        }

        setWorkout(workoutData);
        setDiet(dietData);
        setHistory(historyData || []);
        setLoading(false);

      } catch (err) {
        console.error("Dashboard Error:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dash-wrapper">
        <div className="dash-container">
          <div className="dash-content">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  const userName = "Athlete";
  const streak = history.length;
  const goal = "Muscle Build";

  const progress = workout?.completed ? 100 : 0;
  const workoutTitle = workout?.exercises?.[0]?.name || "Rest Day";
  const recoveryIndex = workout?.recoveryIndexUsed || 0;
  const loadMultiplier = workout?.loadMultiplier || 1;

  const protein = diet?.proteinTarget || 0;
  const carbs = diet?.carbTarget || 0;
  const fats = diet?.fatTarget || 0;

  return (
    <div className="dash-wrapper">
      <div className="dash-container">
        <div className="dash-content">

          {/* HEADER */}
          <div className="header">
            <div className="user-info">
              <div className="avatar"></div>
              <div>
                <p className="greet">GOOD MORNING</p>
                <h2>Saharsh</h2>
              </div>
            </div>
            <div className="bell">
              <FaBell />
            </div>
          </div>

          {/* ACTIVE SESSION */}
          <div className="session-card">
            <span className="badge">ACTIVE SESSION</span>
            <div className="progress-circle">{progress}%</div>
            <h3>{workoutTitle}</h3>
            <p>Recovery Index: {recoveryIndex}</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <button
              className="resume-btn"
              onClick={() => navigate("/workout")}
            >
              <FaPlay /> RESUME WORKOUT
            </button>
          </div>

          {/* ANALYTICS */}
          <div className="section-title">
            <h3>Workout Analytics</h3>
            <span>View detailed report</span>
          </div>

          <div className="analytics-card">
            <p className="volume">
              {workout?.exercises?.length || 0} Exercises
            </p>

            <div className="stats-grid">
              <div className="stat-box">
                <p>STREAK</p>
                <h4>{streak}d</h4>
              </div>

              <div className="stat-box">
                <p>RECOVERY</p>
                <h4>{recoveryIndex}</h4>
              </div>

              <div className="stat-box">
                <p>LOAD</p>
                <h4>{loadMultiplier}x</h4>
              </div>

              <div className="stat-box">
                <p>GOAL</p>
                <h4>{goal}</h4>
              </div>
            </div>
          </div>

          {/* NUTRITION */}
          <h3 className="nutrition-title">Today’s Nutrition</h3>

          <div className="nutrition-card">
            <div className="macro">
              <div className="circle">{protein}g</div>
              <p>Protein</p>
            </div>

            <div className="macro">
              <div className="circle">{carbs}g</div>
              <p>Carbs</p>
            </div>

            <div className="macro">
              <div className="circle">{fats}g</div>
              <p>Fats</p>
            </div>
          </div>

        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          <div className="nav-item active" onClick={() => navigate("/dashboard")}>
            <FaHome />
            <span>Home</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/workout")}>
            <FaDumbbell />
            <span>Workouts</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/diet")}>
            <FaUtensils />
            <span>Nutrition</span>
          </div>

          <div className="nav-item" onClick={() => navigate("/profile")}>
            <FaUser />
            <span>Profile</span>
          </div>
        </div>

      </div>
    </div>
  );
}