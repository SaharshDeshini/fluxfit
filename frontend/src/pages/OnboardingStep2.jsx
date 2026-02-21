import React, { useState } from "react";
import "../Onboarding.css";
import { FaArrowLeft, FaBolt, FaDumbbell, FaTrophy } from "react-icons/fa";

export default function OnboardingStep2({ onNext, onBack }) {
  const [goal, setGoal] = useState("weight");
  const [level, setLevel] = useState("beginner");

  const handleContinue = () => {
    onNext({ goal, experienceLevel: level });
  };

  return (
    <div className="onboard-wrapper">
      <div className="onboard-container">
        <div className="onboard-content">

          <div className="top-row">
            <FaArrowLeft className="back" onClick={onBack} />
            <div className="step-info">
              <span>STEP 2 OF 3</span>
              <p>Goal Setting</p>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill step2"></div>
          </div>

          <h1>What’s your goal?</h1>
          <p className="sub">
            Choose the path that fits your journey.
          </p>

          {["weight", "muscle", "fit"].map((g) => (
            <div
              key={g}
              className={`goal-card ${goal === g ? "active" : ""}`}
              onClick={() => setGoal(g)}
            >
              <h3>
                {g === "weight"
                  ? "Weight Loss"
                  : g === "muscle"
                  ? "Muscle Build"
                  : "Stay Fit"}
              </h3>
              <p>
                {g === "weight"
                  ? "Burn calories and get lean"
                  : g === "muscle"
                  ? "Gain strength and mass"
                  : "Maintain health and flexibility"}
              </p>
            </div>
          ))}

          <h2 className="level-title">Select your level</h2>

          {["beginner", "intermediate", "pro"].map((l) => (
            <div
              key={l}
              className={`level-card ${level === l ? "active" : ""}`}
              onClick={() => setLevel(l)}
            >
              {l === "beginner" && <FaBolt />}
              {l === "intermediate" && <FaDumbbell />}
              {l === "pro" && <FaTrophy />}
              <div>
                <h4>{l.charAt(0).toUpperCase() + l.slice(1)}</h4>
                <p>
                  {l === "beginner"
                    ? "New to fitness training"
                    : l === "intermediate"
                    ? "Regular workout habit"
                    : "Advanced athlete"}
                </p>
              </div>
              <div className="radio"></div>
            </div>
          ))}

        </div>

        <button className="continue-btn" onClick={handleContinue}>
          Continue →
        </button>

      </div>
    </div>
  );
}