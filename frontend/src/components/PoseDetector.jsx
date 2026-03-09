import React, { useEffect, useRef, useState } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { exerciseCounterLoader } from "../lib/motion/exerciseCounterLoader";

const PoseDetector = ({ exerciseId = "fb7180ab-f3e2-4a5d-b731-a2c0fc5de9fa" }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const counterRef = useRef(null);

    const [reps, setReps] = useState(0);
    const [characterMessage, setCharacterMessage] = useState("");

    // Initialize the appropriate counter when exerciseId changes
    useEffect(() => {
        const CounterClass = exerciseCounterLoader[exerciseId];
        if (CounterClass) {
            counterRef.current = new CounterClass();
            setReps(0);
            setCharacterMessage("");
            console.log(`Initialized counter for exercise ID: ${exerciseId}`);
        } else {
            console.error(`No counter found for exercise ID: ${exerciseId}`);
            counterRef.current = null;
        }
    }, [exerciseId]);

    useEffect(() => {
        const pose = new Pose({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
            modelComplexity: 0,
            smoothLandmarks: true,
            minDetectionConfidence: 0.3,
            minTrackingConfidence: 0.3,
        });

        pose.onResults((results) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!results.poseLandmarks) return;

            const landmarks = results.poseLandmarks;

            drawConnectors(ctx, landmarks, POSE_CONNECTIONS, {
                color: "black",
                lineWidth: 3,
            });

            drawLandmarks(ctx, landmarks, {
                color: "white",
                radius: 1,
            });

            // Process motion tracking if we have an active counter
            if (counterRef.current) {
                // Formatting MediaPipe landmarks to the expected array format for our BaseCounter
                // MediaPipe already provides an array of objects {x, y, z, visibility}
                const result = counterRef.current.processPose(landmarks);

                setReps(result.count);
                if (result.alert) {
                    setCharacterMessage(result.alert);
                } else {
                    setCharacterMessage("");
                }
            }
        });

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                if (videoRef.current && canvasRef.current) {
                    await pose.send({ image: videoRef.current });
                }
            },
            width: 640,
            height: 480,
        });

        camera.start();

        videoRef.current.onloadedmetadata = () => {
            if (canvasRef.current && videoRef.current) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
            }
        };

        return () => {
            if (camera) {
                camera.stop();
            }
        }
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: "640px",
                height: "480px",
                margin: "0 auto",
            }}
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "640px",
                    height: "480px",
                    zIndex: 1,
                }}
            />

            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "640px",
                    height: "480px",
                    zIndex: 2,
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    zIndex: 3,
                }}
            >
                Reps: {reps}
            </div>

            {characterMessage && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "15px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#222",
                        color: "white",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        whiteSpace: "nowrap",
                        zIndex: 3,
                    }}
                >
                    🤖 {characterMessage}
                </div>
            )}
        </div>
    );
};

export default PoseDetector;