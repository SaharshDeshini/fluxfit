import React, { useState } from "react";
import "../Onboarding.css";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaStopwatch,
  FaDumbbell,
  FaRunning,
  FaTh,
  FaBuilding
} from "react-icons/fa";

export default function OnboardingStep3({ onBack, onSubmit }) {
  const [days, setDays] = useState(3);
  const [duration, setDuration] = useState(45);
  const [muscle, setMuscle] = useState("full");
  const [gymAccess, setGymAccess] = useState(true);

  const handleSubmit = () => {
    onSubmit({
      workoutDaysPerWeek: Number(days),
      maxWorkoutDuration: Number(duration),
      targetAreas: [muscle],
      equipmentAvailability: gymAccess ? ["gym"] : ["home"],
    });
  };

  return (
    <div className="onboard-wrapper">
      <div className="onboard-container">
        <div className="onboard-content">

          {/* Header */}
          <div className="top-row space-between">
            <div className="circle-back" onClick={onBack}>
              <FaArrowLeft />
            </div>
            <h3>Step 3 of 3</h3>
          </div>

          <div className="progress-label">
            <span>FINALIZING PLAN</span>
            <span>100%</span>
          </div>

          <div className="progress-bar">
            <div className="progress-fill step3"></div>
          </div>

          <h1>
            Onboarding Step 3:
            <span> Commitment</span>
          </h1>

          <p className="sub">
            Fine-tune your training preferences to build your custom plan.
          </p>

          {/* Days */}
          <div className="section">
            <FaCalendarAlt className="orange-icon" />
            <span>How many days per week?</span>
          </div>

          <div className="days-row rounded-days">
            {[1, 2, 3, 4, 5].map((d) => (
              <div
                key={d}
                className={`day-box round ${days === d ? "active" : ""}`}
                onClick={() => setDays(d)}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Duration */}
          <div className="section">
            <FaStopwatch className="orange-icon" />
            <span>Max workout duration</span>
            <b className="orange">{duration} min</b>
          </div>

          <input
            type="range"
            min="15"
            max="90"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="slider glow-slider"
          />

          <div className="range-labels">
            <span>15 MIN</span>
            <span>45 MIN</span>
            <span>90 MIN</span>
          </div>

          {/* Target Muscles */}
          <div className="section">
            <FaDumbbell className="orange-icon" />
            <span>Target Muscle Groups</span>
          </div>

          <div className="muscle-grid">
            <div
              className={`muscle-card ${muscle === "full" ? "active" : ""}`}
              onClick={() => setMuscle("full")}
            >
              <FaDumbbell />
              Full Body
            </div>

            <div
              className={`muscle-card ${muscle === "upper" ? "active" : ""}`}
              onClick={() => setMuscle("upper")}
            >
              <FaBuilding />
              Upper Body
            </div>

            <div
              className={`muscle-card ${muscle === "lower" ? "active" : ""}`}
              onClick={() => setMuscle("lower")}
            >
              <FaRunning />
              Lower Body
            </div>

            <div
              className={`muscle-card ${muscle === "core" ? "active" : ""}`}
              onClick={() => setMuscle("core")}
            >
              <FaTh />
              Core & Abs
            </div>
          </div>

          {/* Gym Access */}
          <div className="gym-box premium">
            <div className="gym-left">
              <div className="gym-icon">
                <FaBuilding />
              </div>
              <div>
                <h4>Gym Access</h4>
                <p>Includes machines and weights</p>
              </div>
            </div>

            <div
              className={`toggle ${gymAccess ? "on" : ""}`}
              onClick={() => setGymAccess(!gymAccess)}
            ></div>
          </div>

          {/* Plan Intensity */}
          <div className="intensity">
            <span>PLAN INTENSITY:</span>
            <div className="dots">
              <div className="dot active"></div>
              <div className="dot active"></div>
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <span className="orange">Moderate</span>
          </div>

        </div>

        <button className="generate-btn premium-btn" onClick={handleSubmit}>
          Generate My Custom Plan ⚡
        </button>

      </div>
    </div>
  );
}