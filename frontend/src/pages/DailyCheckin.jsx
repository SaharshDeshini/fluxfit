import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../DailyCheckin.css";
import {
  FaArrowLeft,
  FaMoon,
  FaBrain,
  FaBolt,
  FaFire,
  FaHome,
  FaDumbbell,
  FaUtensils,
  FaUser
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function DailyCheckin() {
  const navigate = useNavigate();

  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState(4);
  const [soreness, setSoreness] = useState(3);
  const [energy, setEnergy] = useState(8);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("fluxfit_token");

      if (!token) {
        navigate("/");
        return;
      }

      const res = await fetch(
        "https://fluxfit.onrender.com/api/workout/readiness",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sleep: Number(sleep),
            stress: Number(stress),
            soreness: Number(soreness),
            energy: Number(energy),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate plan");
      }

      // After plan generated → go to workout session
      navigate("/workout");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-wrapper">
      <div className="check-container">

        <div className="check-content">

          {/* Header */}
          <div className="top-row">
            <div className="circle-back" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </div>
            <h3>Daily Readiness Check</h3>
          </div>

          <p className="sub">
            Help us optimize your workout for today.
          </p>

          {/* Sleep */}
          <div className="slider-section">
            <div className="slider-label">
              <FaMoon className="orange-icon" />
              <span>Sleep</span>
              <b>{sleep}/10</b>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className="slider"
            />
          </div>

          {/* Stress */}
          <div className="slider-section">
            <div className="slider-label">
              <FaBrain className="orange-icon" />
              <span>Stress</span>
              <b>{stress}/10</b>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={(e) => setStress(e.target.value)}
              className="slider"
            />
          </div>

          {/* Soreness */}
          <div className="slider-section">
            <div className="slider-label">
              <FaFire className="orange-icon" />
              <span>Soreness</span>
              <b>{soreness}/10</b>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={soreness}
              onChange={(e) => setSoreness(e.target.value)}
              className="slider"
            />
          </div>

          {/* Energy */}
          <div className="slider-section">
            <div className="slider-label">
              <FaBolt className="orange-icon" />
              <span>Energy</span>
              <b>{energy}/10</b>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
              className="slider"
            />
          </div>

        </div>

        {/* Submit Button */}
        <button
          className="submit-btn"
          onClick={handleGeneratePlan}
        >
          {loading ? "Generating..." : "Generate Today’s Plan ⚡"}
        </button>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          <NavLink to="/dashboard" className="nav-item">
            <FaHome />
            <span>Home</span>
          </NavLink>

          <NavLink to="/workout" className="nav-item active">
            <FaDumbbell />
            <span>Training</span>
          </NavLink>

          <NavLink to="/diet" className="nav-item">
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