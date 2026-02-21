import React, { useState } from "react";
import "../WorkoutSession.css";
import PoseDetector from "../components/PoseDetector";
import {
  FaHome,
  FaDumbbell,
  FaUtensils,
  FaUser,
  FaPause,
  FaVideo,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function WorkoutSession() {
  const navigate = useNavigate();
  const [startWorkout, setStartWorkout] = useState(false);
  const [currentExercise, setCurrentExercise] = useState("Squats");
  const [progress] = useState(60);
  const [paused, setPaused] = useState(false);

  const exercises = [
    { name: "Leg Press", sets: "4 × 12" },
    { name: "Squats", sets: "5 × 10" },
    { name: "Lunges", sets: "3 × 12" },
  ];

  return (
    <div className="workout-wrapper">
      <div className="workout-container">

        {/* Header */}
        <div className="session-header">
          <div>
            <p className="active-label">ACTIVE SESSION</p>
            <h1>Leg Day Power</h1>
          </div>
          <div className="progress-info">
            <p>Step 4 of 8</p>
            <p>{progress}% Complete</p>
          </div>
        </div>

        <div className="top-progress">
          <div
            className="top-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Image Section */}
        <div className="exercise-image">
          <img
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e"
            alt="exercise"
          />

          <div className="exercise-card">
            <h2>Barbell Squats</h2>

            <div className="exercise-tags">
              <span className="tag-orange">Set 3 of 5</span>
              <span className="tag-gray">85kg Target</span>
              <button
                className="pause-btn"
                onClick={() => setPaused(!paused)}
              >
                <FaPause />
              </button>
            </div>

            <div className="stats-row">
              <div>
                <p>REST TIMER</p>
                <h3>01:45</h3>
              </div>
              <div>
                <p>PREV SET</p>
                <h3>12 Reps</h3>
              </div>
              <div>
                <p>HEART RATE</p>
                <h3>142 BPM</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Routine Lineup */}
        <div className="section-row">
          <h3>Routine Lineup</h3>
          <span>View All</span>
        </div>

        <div className="exercise-list">
          {exercises.map((ex, index) => (
            <div
              key={index}
              className={
                currentExercise === ex.name
                  ? "exercise-item active"
                  : "exercise-item"
              }
              onClick={() => setCurrentExercise(ex.name)}
            >
              <h4>{ex.name}</h4>
              <p>{ex.sets}</p>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <h3 className="upcoming-title">Upcoming Schedule</h3>

        <div className="schedule-card">
          <div className="schedule-date">TUE 14</div>
          <div>
            <h4>Upper Body Power</h4>
            <p>Chest, Shoulders & Triceps</p>
          </div>
        </div>

        <div className="schedule-card">
          <div className="schedule-date orange">WED 15</div>
          <div>
            <h4>Active Recovery</h4>
            <p>Yoga & Mobility Routine</p>
          </div>
        </div>

      
        {/* Camera Control Section */}
<div className="camera-section" style={{ marginTop: "20px", textAlign: "center" }}>
  {!startWorkout ? (
    <button
      className="camera-btn start"
      style={{
        backgroundColor: "#FF5722",
        color: "white",
        padding: "15px 30px",
        borderRadius: "30px",
        border: "none",
        fontWeight: "bold",
        fontSize: "16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        margin: "0 auto"
      }}
      onClick={() => setStartWorkout(true)}
    >
      <FaVideo /> Start AI Trainer
    </button>
  ) : (
    <>
      <PoseDetector active={startWorkout} />
      
      <button
        className="camera-btn stop"
        style={{
          backgroundColor: "#d32f2f",
          color: "white",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          marginTop: "15px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
        onClick={() => setStartWorkout(false)}
      >
        Stop Camera
      </button>
    </>
  )}
</div>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          <div onClick={() => navigate("/dashboard")}>
            <FaHome />
            <span>Home</span>
          </div>
          <div className="active">
            <FaDumbbell />
            <span>Workouts</span>
          </div>
          <div onClick={() => navigate("/diet")}>
            <FaUtensils />
            <span>Nutrition</span>
          </div>
          <div onClick={() => navigate("/profile")}>
            <FaUser />
            <span>Profile</span>
          </div>
        </div>

      </div>
    </div>
  );
}