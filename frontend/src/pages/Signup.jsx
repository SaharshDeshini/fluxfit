import React, { useState } from "react";
import "../Signup.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 30;
    if (password.length < 8) return 60;
    return 100;
  };

  // ✅ Send token using Authorization header
  const sendTokenToBackend = async (user) => {
    const token = await user.getIdToken();

    const res = await fetch(
      "https://fluxfit.onrender.com/api/auth/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Authentication failed");
    }

    localStorage.setItem("fluxfit_token", token);

    if (data.redirectTo === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  // ✅ Email Signup
  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName: name,
      });

      await sendTokenToBackend(result.user);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Signup
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await sendTokenToBackend(result.user);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <span>FLUXFIT</span>
        </div>

        <h1>
          Join the <span className="orange">Flux Fit</span>
        </h1>
        <p className="subtitle">Start your journey today.</p>

        <label>Full Name</label>
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <label>Email Address</label>
        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label>Password</label>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="strength-bar">
          <div
            className="strength-fill"
            style={{ width: `${getStrength()}%` }}
          />
        </div>

        <p className="password-info">
          Password must be at least 8 characters
        </p>

        <button className="signup-btn" onClick={handleSignup}>
          {loading ? "Creating Account..." : <>Sign Up <FaArrowRight /></>}
        </button>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <button className="google-btn" onClick={handleGoogleSignup}>
          <FcGoogle size={20} /> Google
        </button>

        <p className="signin-text">
          Already a member?{" "}
          <span onClick={() => navigate("/")}>Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;