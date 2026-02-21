import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Well.css";
import {
  FaArrowLeft,
  FaBook,
  FaHeart,
  FaPause,
  FaPlay,
  FaHome,
  FaDumbbell,
  FaUtensils,
  FaUser
} from "react-icons/fa";

const Well = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("fluxfit_token");

  const [selectedTime, setSelectedTime] = useState(10);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  /* =============================
      TIMER LOGIC
  ============================== */
  useEffect(() => {
    let timer;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    // When timer hits 0
    if (timeLeft === 0 && !sessionCompleted) {
      setIsRunning(false);
      setSessionCompleted(true);
      sendMeditationToBackend(selectedTime * 60);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  /* =============================
      SEND TO BACKEND
  ============================== */
  const sendMeditationToBackend = async (duration) => {
    try {
      if (!token) {
        navigate("/");
        return;
      }

      const res = await fetch(
        "https://fluxfit.onrender.com/api/wellness/meditation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            durationInSeconds: duration
          })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Meditation save failed");

      alert(
        `Session Complete 🧘‍♂️\nTotal Today: ${data.totalMeditationToday}s`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to save meditation");
    }
  };

  /* =============================
      HELPERS
  ============================== */
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const selectDuration = (min) => {
    setSelectedTime(min);
    setTimeLeft(min * 60);
    setIsRunning(false);
    setSessionCompleted(false);
  };

  const progress =
    ((selectedTime * 60 - timeLeft) / (selectedTime * 60)) * 100;

  /* =============================
      UI
  ============================== */
  return (
    <div className="wellness-container">

      {/* HEADER */}
      <div className="wellness-header">
        <FaArrowLeft onClick={() => navigate("/dashboard")} />
        <h2>WELLNESS & MIND</h2>
        <FaBook />
      </div>

      {/* TIMER */}
      <div className="circle-wrapper">
        <svg width="260" height="260">
          <circle cx="130" cy="130" r="115" className="circle-bg" />
          <circle
            cx="130"
            cy="130"
            r="115"
            className="circle-progress"
            style={{ "--progress": progress }}
          />
        </svg>

        <div className="timer-text">
          <h1>{formatTime()}</h1>
          <p>TIME REMAINING</p>
        </div>
      </div>

      {/* TIME OPTIONS */}
      <div className="time-options">
        {[5, 10, 20, 30].map((min) => (
          <button
            key={min}
            className={`time-btn ${
              selectedTime === min ? "active" : ""
            }`}
            onClick={() => selectDuration(min)}
          >
            {min}m
          </button>
        ))}
      </div>

      {/* START BUTTON */}
      <button
        className="start-btn"
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? "PAUSE MEDITATION" : "START MEDITATION"}
      </button>

      {/* LIBRARY */}
      <h4 className="library-title">AMBIENT LIBRARY</h4>

      <div className="library-card">
        <img src="https://picsum.photos/80" alt="zen" />
        <div className="library-info">
          <h3>Zen Forest</h3>
          <p>Nature Sounds • 432Hz</p>
          <div className="progress-bar">
            <div className="progress-inner"></div>
          </div>
        </div>
        <FaHeart className="heart-icon" />
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <button className="control-btn">
          <FaPlay />
        </button>
        <button className="main-control">
          {isRunning ? <FaPause /> : <FaPlay />}
        </button>
        <button className="control-btn rotate-icon">
          <FaPlay />
        </button>
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <button onClick={() => navigate("/dashboard")}>
          <FaHome />
          <span>Home</span>
        </button>

        <button className="active-nav">
          <FaDumbbell />
          <span>Training</span>
        </button>

        <button onClick={() => navigate("/diet")}>
          <FaUtensils />
          <span>Nutrition</span>
        </button>

        <button onClick={() => navigate("/profile")}>
          <FaUser />
          <span>Profile</span>
        </button>
      </div>

    </div>
  );
};

export default Well;