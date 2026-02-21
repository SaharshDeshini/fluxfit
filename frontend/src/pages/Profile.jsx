import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Profile.css";
import {
  FaBolt,
  FaCog,
  FaDumbbell,
  FaChevronRight,
  FaSignOutAlt,
  FaHome,
  FaUtensils,
  FaUser,
  FaArrowLeft
} from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("fluxfit_token");

  const [user, setUser] = useState({ name: "Saharsh", profileImage: "" });
  const [workouts, setWorkouts] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
      FETCH USER DATA & HISTORY
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          navigate("/");
          return;
        }

        // Fetch both User Profile and Workout History
        const [profileRes, historyRes] = await Promise.all([
          fetch("https://fluxfit.onrender.com/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("https://fluxfit.onrender.com/api/workout/history", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!profileRes.ok || !historyRes.ok) throw new Error("Failed to fetch data");

        const profileData = await profileRes.json();
        const historyData = await historyRes.json();

        setUser({
          name: profileData.name || "Flux User",
          profileImage: profileData.profileImage || "https://via.placeholder.com/150"
        });
        setWorkouts(historyData || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  /* =========================
      UPDATE PROFILE (Weight)
  ========================= */
  const handleUpdateWeight = async () => {
    if (!newWeight) return;

    try {
      const res = await fetch("https://fluxfit.onrender.com/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ weight: Number(newWeight) })
      });

      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();

      alert("Profile Updated ✅");
      if (data.dietRegenerated) alert("Diet Plan Updated 🍽️");
      if (data.workoutRegenerated) alert("Workout Plan Updated 💪");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fluxfit_token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="profile-wrapper">
        <h2 style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="phone">
        
        {/* TOP BAR */}
        <div className="top-bar">
          <div className="brand">
            <FaBolt className="orange" />
            <span>FluxFit</span>
          </div>
          {/* LOGOUT INTEGRATED INTO SETTINGS TOP RIGHT */}
          <button className="settings-logout" onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>

        <div className="content-area">
          {!showHistory ? (
            <>
              {/* DYNAMIC PROFILE INFO */}
              <div className="profile-section">
                <div className="avatar-ring">
                  <img
                    src={user.profileImage}
                    alt="profile"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                  />
                </div>
                <h2>{user.name}</h2>
                <p>Keep pushing forward 💪</p>
              </div>

              {/* STATS */}
              <div className="stats">
                <div className="stat">
                  <h3>{workouts.length}</h3>
                  <span>WORKOUTS</span>
                </div>
                <div className="stat">
                  <h3>
                    {workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0)}
                  </h3>
                  <span>CALORIES</span>
                </div>
                <div className="stat">
                  <h3>{workouts.length > 0 ? "🔥" : "-"}</h3>
                  <span>ACTIVE</span>
                </div>
              </div>

              {/* QUICK ACCESS */}
              <div className="quick-actions">
                <button className="quick-btn" onClick={() => navigate("/well")}>
                  🧘 Wellness
                </button>
                <button className="quick-btn secondary" onClick={() => navigate("/community")}>
                  🌍 Community
                </button>
              </div>

              {/* UPDATE WEIGHT SECTION */}
<div className="weight-update-card">
  <h4>Body Weight Progress</h4>
  <div className="weight-input-group">
    <input
      type="number"
      placeholder="00.0 kg"
      value={newWeight}
      onChange={(e) => setNewWeight(e.target.value)}
      className="weight-field"
    />
    <button className="weight-submit-btn" onClick={handleUpdateWeight}>
      Update Now
    </button>
  </div>
</div>
              {/* HISTORY PREVIEW */}
              <div className="section-header">
                <h4>Recent Activity</h4>
                <button className="see-all-btn" onClick={() => setShowHistory(true)}>
                  SEE ALL
                </button>
              </div>

              {workouts.length > 0 ? (
                workouts.slice(0, 2).map((w, i) => (
                  <button key={i} className="workout-card">
                    <div className="icon-box"><FaDumbbell /></div>
                    <div className="workout-info">
                      <h5>{new Date(w.date).toLocaleDateString()}</h5>
                      <p>{w.totalTime || 0} mins • {w.caloriesBurned || 0} kcal</p>
                    </div>
                    <FaChevronRight className="chevron" />
                  </button>
                ))
              ) : (
                <p style={{ color: "#888", textAlign: "center" }}>No workouts recorded yet.</p>
              )}
            </>
          ) : (
            <>
              {/* FULL HISTORY VIEW */}
              <div className="history-header">
                <button onClick={() => setShowHistory(false)} className="back-btn">
                  <FaArrowLeft />
                </button>
                <h3>Workout History</h3>
                <div style={{ width: "24px" }}></div>
              </div>

              <div className="history-list">
                {workouts.map((w, i) => (
                  <div key={i} className="workout-card">
                    <div className="icon-box"><FaDumbbell /></div>
                    <div className="workout-info">
                      <h5>{new Date(w.date).toLocaleDateString()}</h5>
                      <p>{w.totalExercises || 0} exercises • {w.totalReps || 0} reps</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          <button onClick={() => navigate("/dashboard")}>
            <FaHome />
            <span>HOME</span>
          </button>
          <button onClick={() => navigate("/workout")}>
            <FaDumbbell />
            <span>WORKOUTS</span>
          </button>
          <button onClick={() => navigate("/diet")}>
            <FaUtensils />
            <span>NUTRITION</span>
          </button>
          <button className="active-nav">
            <FaUser />
            <span>PROFILE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;