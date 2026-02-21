import React, { useEffect, useState } from "react";
import "../DietDashboard.css";
import {
  FaBell,
  FaUtensils,
  FaPlus,
  FaCheck,
  FaHome,
  FaDumbbell,
  FaUser,
  FaCoffee,
  FaHamburger,
  FaCookie,
  FaMoon
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function DietDashboard() {
  const [meal, setMeal] = useState("breakfast");
  const [activeDiet, setActiveDiet] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [queryText, setQueryText] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("fluxfit_token");

  /* ===========================
      FETCH ACTIVE DIET
  =========================== */
  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const res = await fetch(
          "https://fluxfit.onrender.com/api/diet/active",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch diet");

        setActiveDiet(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiet();
  }, []);

  /* ===========================
      DIET QUERY (AI)
  =========================== */
  const handleQuery = async () => {
    if (!queryText.trim()) return;

    try {
      const res = await fetch(
        "https://fluxfit.onrender.com/api/diet/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ queryText })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Query failed");

      setActiveDiet((prev) => ({
        ...prev,
        ...data.suggestedPlan
      }));

    } catch (err) {
      alert(err.message);
    }
  };

  /* ===========================
      CONFIRM DIET
  =========================== */
  const handleConfirm = async () => {
    try {
      const res = await fetch(
        "https://fluxfit.onrender.com/api/diet/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            newPlan: {
              breakfast: activeDiet.breakfast,
              lunch: activeDiet.lunch,
              dinner: activeDiet.dinner,
              snacks: activeDiet.snacks
            }
          })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Confirm failed");

      alert("Diet Plan Confirmed ✅");
    } catch (err) {
      alert(err.message);
    }
  };

  /* ===========================
      CHEAT / OVERRIDE
  =========================== */
  const handleOverride = async () => {
    try {
      const res = await fetch(
        "https://fluxfit.onrender.com/api/diet/override",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ overrideType: "cheat" })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Override failed");

      alert(`Extra ${data.extraCaloriesAllowed} kcal allowed 🍕`);
    } catch (err) {
      alert(err.message);
    }
  };

  const foods = activeDiet ? activeDiet[meal] || [] : [];

  if (loading) {
    return <div className="diet-wrapper"><h2>Loading...</h2></div>;
  }

  return (
    <div className="diet-wrapper">
      <div className="diet-container">

        {/* HEADER */}
        <div className="diet-header">
          <div className="diet-title">
            <div className="diet-icon">
              <FaUtensils />
            </div>
            <div>
              <h2>Nutrition</h2>
              <p>{activeDiet.calorieTarget} kcal target</p>
            </div>
          </div>
          <div className="bell">
            <FaBell />
          </div>
        </div>

        {/* SEARCH / AI QUERY */}
        <input
          className="search-bar"
          placeholder="Ask AI (e.g., High protein vegetarian)"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuery()}
        />

        {/* MEAL SELECTOR */}
        <div className="meal-row">
          <div className={`meal-pill ${meal === "breakfast" ? "active" : ""}`} onClick={() => setMeal("breakfast")}>
            <FaCoffee />
            <span>BREAKFAST</span>
          </div>
          <div className={`meal-pill ${meal === "lunch" ? "active" : ""}`} onClick={() => setMeal("lunch")}>
            <FaHamburger />
            <span>LUNCH</span>
          </div>
          <div className={`meal-pill ${meal === "snacks" ? "active" : ""}`} onClick={() => setMeal("snacks")}>
            <FaCookie />
            <span>SNACKS</span>
          </div>
          <div className={`meal-pill ${meal === "dinner" ? "active" : ""}`} onClick={() => setMeal("dinner")}>
            <FaMoon />
            <span>DINNER</span>
          </div>
        </div>

        {/* FOOD LIST */}
        {foods.length === 0 ? (
          <p style={{ color: "#9ca3af", marginTop: "20px" }}>
            No items found.
          </p>
        ) : (
          foods.map((item, index) => (
            <div key={index} className="food-card">
              <div className="food-content">
                <h4>{item.name || item}</h4>
              </div>
            </div>
          ))
        )}

        {/* ACTION BUTTONS */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm Plan
          </button>
          <button className="override-btn" onClick={handleOverride}>
            Cheat Day 🍔
          </button>
        </div>

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          <NavLink to="/dashboard" className="nav-item">
            <FaHome />
            <span>Home</span>
          </NavLink>

          <NavLink to="/workout" className="nav-item">
            <FaDumbbell />
            <span>Workouts</span>
          </NavLink>

          <NavLink to="/diet" className="nav-item active">
            <FaUtensils />
            <span>Nutrition</span>
          </NavLink>

          <NavLink to="/profile" className="nav-item">
            <FaUser />
            <span>Profile</span>
          </NavLink>
        </div>

      </div>
    </div>
  );
}