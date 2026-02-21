import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import OnboardingStep1 from "./OnboardingStep1";
import OnboardingStep2 from "./OnboardingStep2";
import OnboardingStep3 from "./OnboardingStep3";

// 🔥 Toggle this when backend is ready
const DEV_MODE = false;

export default function OnboardingFlow() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  // Merge step data
  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  // 🔥 Final Submission
 const handleSubmit = async (data) => {
  const rawData = { ...formData, ...data };

  const finalData = {
    age: rawData.age,
    gender: rawData.gender,
    height: rawData.height,
    weight: rawData.weight,
    goal:
      rawData.goal === "muscle"
        ? "muscle_gain"
        : rawData.goal === "weight"
        ? "fat_loss"
        : "maintenance",
    experienceLevel: rawData.experienceLevel,
    workoutDaysPerWeek: rawData.workoutDaysPerWeek,
    maxWorkoutDuration: Number(rawData.maxWorkoutDuration),
    targetAreas: rawData.targetAreas,
    equipmentAvailability: rawData.equipmentAvailability,
    dietPreference: "vegetarian",   // TEMP FIX
    dailyFoodBudget: 300            // TEMP FIX
  };

  console.log("🔥 Sending Clean Data:", finalData);

    console.log("🚀 Final Onboarding Data:", finalData);

    // ===============================
    // PREVIEW MODE (No Backend)
    // ===============================
    if (DEV_MODE) {
      setTimeout(() => {
        alert("Onboarding Completed Successfully (Preview Mode)");
        navigate("/dashboard");
      }, 800);
      return;
    }

    // ===============================
    // REAL BACKEND MODE
    // ===============================
    try {
      const token = localStorage.getItem("fluxfit_token");

      const res = await fetch(
        "https://fluxfit.onrender.com/api/user/onboarding",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(finalData),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Submission failed");
      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  // Step Switch
  if (step === 1)
    return <OnboardingStep1 onNext={handleNext} />;

  if (step === 2)
    return (
      <OnboardingStep2
        onNext={handleNext}
        onBack={handleBack}
      />
    );

  if (step === 3)
    return (
      <OnboardingStep3
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
    );

  return null;
}