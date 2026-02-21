import React, { useState } from "react";
import "../Login.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth, googleProvider } from "../firebase"; // ✅ make sure path correct

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 Send token to backend
  const sendTokenToBackend = async (user) => {
  try {
    const token = await user.getIdToken();

    const res = await fetch(
      "https://fluxfit.onrender.com/api/auth/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,   // ✅ THIS IS THE FIX
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
  } catch (error) {
    alert(error.message);
  }
};
  // Email Login
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendTokenToBackend(result.user);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
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

  // Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Enter email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="icon-circle">🏋️</div>

        <h1 className="logo-text">FluxFit</h1>
        <p className="subtitle">
          Performance.Perfected Daily
        </p>

        <label>Email Address</label>
        <div className="input-box">
          <FaEnvelope className="icon" />
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="password-row">
          <label>Password</label>
          <span onClick={handleForgotPassword}>
            Forgot Password?
          </span>
        </div>

        <div className="input-box">
          <FaLock className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <FaEyeSlash
              className="eye"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaEye
              className="eye"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        <button className="login-btn" onClick={handleLogin}>
          {loading ? "Please wait..." : "LOG IN →"}
        </button>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <FcGoogle size={20} />
          Google
        </button>

        <p className="footer">
          Don’t have an account?
          <span onClick={handleSignUp}> Sign Up</span>
        </p>
      </div>
    </div>
  );
}