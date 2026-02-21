import React, { useEffect, useRef, useState } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const PoseDetector = ({ active }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  const repsRef = useRef(0);
  const stageRef = useRef("up");
  const exerciseRef = useRef("Detecting...");
  const exerciseVotesRef = useRef([]);

  const [reps, setReps] = useState(0);
  const [exercise, setExercise] = useState("Detecting...");
  const [characterMessage, setCharacterMessage] = useState("");

  const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  };

  const classifyExercise = (landmarks) => {
    const shoulder = landmarks[11];
    const elbow = landmarks[13];
    const wrist = landmarks[15];
    const hip = landmarks[23];
    const knee = landmarks[25];
    const ankle = landmarks[27];

    const kneeAngle = calculateAngle(hip, knee, ankle);
    const elbowAngle = calculateAngle(shoulder, elbow, wrist);
    const bodyAngle = calculateAngle(shoulder, hip, ankle);

    if (bodyAngle > 150 && elbowAngle < 150) return "Pushup";
    if (kneeAngle < 150) return "Squat";
    if (elbowAngle < 100 && bodyAngle > 80 && bodyAngle < 120) return "Bicep Curl";
    return "Unknown";
  };

  useEffect(() => {
    if (!active) return;

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1, // 1 is better for mobile performance/accuracy balance
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas size to match video feed
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the video frame
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 3,
        });
        drawLandmarks(ctx, results.poseLandmarks, {
          color: "#FF0000",
          radius: 4,
        });

        const landmarks = results.poseLandmarks;
        const detected = classifyExercise(landmarks);

        // Vote Buffer for Stability
        exerciseVotesRef.current.push(detected);
        if (exerciseVotesRef.current.length > 15) exerciseVotesRef.current.shift();
        
        const counts = {};
        exerciseVotesRef.current.forEach((e) => counts[e] = (counts[e] || 0) + 1);
        const stableExercise = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

        if (exerciseRef.current !== stableExercise) stageRef.current = "up";
        exerciseRef.current = stableExercise;
        setExercise(stableExercise);

        // Movement Logic
        const kneeAngle = calculateAngle(landmarks[23], landmarks[25], landmarks[27]);
        const elbowAngle = calculateAngle(landmarks[11], landmarks[13], landmarks[15]);

        if (stableExercise === "Squat") {
          if (kneeAngle < 100 && stageRef.current === "up") stageRef.current = "down";
          if (kneeAngle > 150 && stageRef.current === "down") {
            stageRef.current = "up";
            repsRef.current++;
            setReps(repsRef.current);
            setCharacterMessage("Good Squat!");
          }
        } else if (stableExercise === "Pushup") {
          if (elbowAngle < 90 && stageRef.current === "up") stageRef.current = "down";
          if (elbowAngle > 150 && stageRef.current === "down") {
            stageRef.current = "up";
            repsRef.current++;
            setReps(repsRef.current);
            setCharacterMessage("Nice Pushup!");
          }
        }
      }
      ctx.restore();
    });

    if (videoRef.current) {
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 1280,
        height: 720,
      });
      cameraRef.current.start();
    }

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      pose.close();
    };
  }, [active]);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "black"
    }}>
      <video
        ref={videoRef}
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)", // Mirror effect
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 2,
          transform: "scaleX(-1)", // Mirror effect
        }}
      />

      {/* UI Overlay */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "15px",
        borderRadius: "12px",
        fontFamily: "sans-serif"
      }}>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>Reps: {reps}</div>
        <div style={{ fontSize: "14px", color: "#00FF00" }}>Mode: {exercise}</div>
      </div>

      {characterMessage && (
        <div style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#00FF00",
          color: "black",
          padding: "10px 20px",
          borderRadius: "20px",
          fontWeight: "bold",
          zIndex: 10
        }}>
          {characterMessage}
        </div>
      )}
    </div>
  );
};

export default PoseDetector;     