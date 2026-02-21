import React, { useState } from "react";
import "../Onboarding.css";
import { FaMars, FaVenus, FaTransgender, FaInfoCircle } from "react-icons/fa";

export default function OnboardingStep1({ onNext }) {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(25);
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(75);

  const handleContinue = () => {
    onNext({
      gender,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      heightUnit,
      weightUnit,
    });
  };

  return (
    <div className="onboard-wrapper">
      <div className="onboard-container">
        <div className="onboard-content">

          {/* Header */}
          <div className="step-row">
            <span className="step">STEP 1 OF 3</span>
            <span className="percent">33% Complete</span>
          </div>

          <div className="progress-bar">
            <div className="progress-fill step1"></div>
          </div>

          <h1>Tell us about yourself</h1>
          <p className="sub">
            This helps us calculate your personalized goals and daily requirements.
          </p>

          {/* Gender */}
          <div className="gender-row">
            <div
              className={`gender-card ${gender === "male" ? "active" : ""}`}
              onClick={() => setGender("male")}
            >
              <FaMars />
              <p>MALE</p>
            </div>

            <div
              className={`gender-card ${gender === "female" ? "active" : ""}`}
              onClick={() => setGender("female")}
            >
              <FaVenus />
              <p>FEMALE</p>
            </div>

            <div
              className={`gender-card ${gender === "other" ? "active" : ""}`}
              onClick={() => setGender("other")}
            >
              <FaTransgender />
              <p>OTHER</p>
            </div>
          </div>

          {/* Age */}
          <div className="age-row">
            <span>
              Age <b>{age} yrs</b>
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="100"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="slider"
          />

          {/* Height */}
          <div className="unit-row">
            <span>Height</span>
            <div className="segmented">
              <button
                type="button"
                className={heightUnit === "cm" ? "active" : ""}
                onClick={() => setHeightUnit("cm")}
              >
                CM
              </button>
              <button
                type="button"
                className={heightUnit === "ft" ? "active" : ""}
                onClick={() => setHeightUnit("ft")}
              >
                FT
              </button>
            </div>
          </div>

          <div className="input-box">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
            <span>{heightUnit}</span>
          </div>

          {/* Weight */}
          <div className="unit-row">
            <span>Weight</span>
            <div className="segmented">
              <button
                type="button"
                className={weightUnit === "lbs" ? "active" : ""}
                onClick={() => setWeightUnit("lbs")}
              >
                LBS
              </button>
              <button
                type="button"
                className={weightUnit === "kg" ? "active" : ""}
                onClick={() => setWeightUnit("kg")}
              >
                KG
              </button>
            </div>
          </div>

          <div className="input-box">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
            <span>{weightUnit}</span>
          </div>

          {/* Info */}
          <div className="info-box">
            <FaInfoCircle />
            <p>
              Your data is encrypted and only used to improve your health metrics.
              We never share your personal information.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="continue-btn"
          onClick={handleContinue}
        >
          Continue →
        </button>

      </div>
    </div>
  );
}