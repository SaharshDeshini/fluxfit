import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Loader2 } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";
import PoseDetector from "../components/PoseDetector";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import NavigationBar from "../components/NavigationBar";

export default function WorkoutSessionPage() {
    const navigate = useNavigate();

    // Demo API checks and Workout Finish logic...

    const [progress, setProgress] = useState(60);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiMessage, setAiMessage] = useState("");
    const [isCameraActive, setIsCameraActive] = useState(false);

    const checkFormFeedback = async () => {
        try {
            const res = await api.post('/api/character/message', {
                exerciseName: "Barbell Squats",
                repNumber: 5,
                formScore: 85,
                fatigueLevel: "Medium"
            });
            if (res.data && res.data.aiMessage) {
                setAiMessage(res.data.aiMessage);
            }
        } catch (error) {
            console.error("Failed to fetch AI feedback", error);
        }
    };

    const finishWorkout = async () => {
        setLoading(true);
        try {
            await api.post('/api/workout/complete', {
                totalTime: 45,
                exercises: [
                    { name: "Barbell Squats", totalReps: 25, avgFormScore: 90 },
                    { name: "Leg Press", totalReps: 40, avgFormScore: 85 }
                ]
            });
            toast.success("Workout Complete! Excellent job.");
            navigate('/dashboard');
        } catch (error) {
            toast.success("Workout Complete! (Offline Mode)");
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0a0a0a] text-slate-100 min-h-screen pb-32 font-sans relative">
            {/* Header Section */}
            <header className="p-6 pt-8 space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">Active Session</p>
                        <h1 className="text-2xl font-bold tracking-tight text-white leading-none">Leg Day Power</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-xs font-semibold mb-1">Step 4 of 8</p>
                        <p className="text-white text-sm font-bold">60% Complete</p>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="h-2 w-full bg-[#1f1f1f] rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </header>

            <main className="px-6 space-y-10 pb-6">
                {aiMessage && (
                    <div className="p-4 rounded-xl bg-orange-900/20 border border-orange-500/30 text-orange-200 text-sm flex gap-3 items-start shadow-lg shadow-orange-900/10">
                        <span className="material-symbols-outlined text-primary mt-0.5 text-lg">smart_toy</span>
                        <p className="leading-relaxed">"{aiMessage}"</p>
                        <button onClick={() => setAiMessage("")} className="text-orange-500/50 hover:text-orange-400 ml-auto bg-transparent border-none">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}

                {/* Main Active Exercise Card */}
                <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    <Tilt className="parallax-effect h-full" perspective={1000} glareEnable={true} glareMaxOpacity={0.4} glareColor="rgba(255,255,255,0.2)" glarePosition="all" glareBorderRadius="32px" scale={1.01} transitionSpeed={1000} tiltMaxAngleX={5} tiltMaxAngleY={5}>
                        <div className="relative overflow-hidden rounded-[32px] bg-white/5 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/10 min-h-[420px]">
                            {isCameraActive ? (
                                <div className="absolute inset-0 z-0 bg-black flex flex-col items-center justify-center overflow-hidden">
                                    {/* Using the Squat exercise UUID from the loader */}
                                    <PoseDetector exerciseId="fb7180ab-f3e2-4a5d-b731-a2c0fc5de9fa" />
                                </div>
                            ) : (
                                <>
                                    {/* Background Image */}
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80')" }}></div>
                                    {/* Gradient Overlay for Text Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>

                                    {/* Card Content (Bottom Aligned) */}
                                    <div className="absolute bottom-0 w-full p-6 space-y-6 z-10">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-3">
                                                <h2 className="text-3xl font-bold text-white leading-none tracking-tight drop-shadow-md">Barbell Squats</h2>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1.5 rounded-full border border-primary/50 text-white text-[11px] font-bold shadow-[0_0_15px_rgba(255,106,0,0.3)] bg-primary/20 backdrop-blur-md uppercase tracking-wider">Set 3 of 5</span>
                                                    <span className="px-3 py-1.5 rounded-full border border-white/10 text-slate-200 text-[11px] font-bold bg-white/5 backdrop-blur-md uppercase tracking-wider">85kg Target</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setIsPaused(!isPaused);
                                                    if (isPaused) {
                                                        setProgress(prev => Math.min(prev + 10, 100));
                                                    } else {
                                                        // Request feedback when pausing (simulating end of set)
                                                        checkFormFeedback();
                                                    }
                                                }}
                                                className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-tr from-primary to-[#ff4e00] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.5)] transition-transform active:scale-95 border border-primary/50"
                                            >
                                                <span className="material-symbols-outlined text-3xl">{isPaused ? "play_arrow" : "pause"}</span>
                                            </button>
                                        </div>

                                        {/* Metrics Row */}
                                        <div className="flex justify-between pt-6 border-t border-white/10">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Rest Timer</p>
                                                <p className="text-xl font-bold text-white">01:45</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Prev Set</p>
                                                <p className="text-xl font-bold text-white">12 Reps</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Heart Rate</p>
                                                <p className="text-xl font-bold text-white">142 BPM</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Tilt>
                </motion.section>

                {/* Routine Lineup (Horizontal Scroll) */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white tracking-tight">Routine Lineup</h3>
                        <button className="text-primary text-[11px] uppercase tracking-widest font-bold bg-transparent border-none">View All</button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scrollbar -mx-6 px-6">
                        {/* Completed Item */}
                        <Tilt className="snap-start shrink-0 w-36" perspective={500} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="24px" scale={1.05}>
                            <div className="h-full p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 relative shadow-[0_10px_20px_rgba(0,0,0,0.3)] opacity-60">
                                <div className="absolute top-3 right-3 text-white bg-green-500/50 rounded-full w-5 h-5 flex items-center justify-center border border-green-400">
                                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-2xl mb-6">fitness_center</span>
                                <h4 className="font-bold text-slate-200 text-sm tracking-tight">Leg Press</h4>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">4 Sets × 12</p>
                            </div>
                        </Tilt>

                        {/* Active Item */}
                        <Tilt className="snap-start shrink-0 w-36" perspective={500} glareEnable={true} glareMaxOpacity={0.2} glareBorderRadius="24px" scale={1.05}>
                            <div className="h-full p-4 rounded-3xl bg-[#2a1300]/80 backdrop-blur-xl border border-primary relative shadow-[0_0_20px_rgba(255,106,0,0.2)]">
                                <span className="material-symbols-outlined text-primary text-2xl mb-6 drop-shadow-[0_0_10px_rgba(255,106,0,0.8)]">layers</span>
                                <h4 className="font-bold text-white text-sm tracking-tight">Squats</h4>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mt-1">5 Sets × 10</p>
                            </div>
                        </Tilt>

                        {/* Upcoming Item */}
                        <Tilt className="snap-start shrink-0 w-36" perspective={500} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="24px" scale={1.05}>
                            <div className="h-full p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 relative shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                                <span className="material-symbols-outlined text-slate-400 text-2xl mb-6">accessibility_new</span>
                                <h4 className="font-bold text-white text-sm tracking-tight">Lunges</h4>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">3 Sets × 15</p>
                            </div>
                        </Tilt>
                    </div>
                </motion.section>

                {/* Upcoming Schedule */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-4">
                    <h3 className="text-lg font-bold text-white tracking-tight">Upcoming Schedule</h3>

                    <div className="space-y-3">
                        <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.05} glareBorderRadius="24px" scale={1.01}>
                            <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 cursor-pointer shadow-lg group hover:border-white/20 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-black/40 shadow-inner flex flex-col items-center justify-center shrink-0 border border-white/5">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tue</span>
                                    <span className="text-sm font-bold text-white leading-none mt-0.5">14</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white text-sm tracking-tight">Upper Body Power</h4>
                                    <p className="text-xs text-slate-400 mt-1">Chest, Shoulders & Triceps</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-500 text-lg group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </div>
                        </Tilt>

                        <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.05} glareBorderRadius="24px" scale={1.01}>
                            <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 cursor-pointer shadow-lg group hover:border-white/20 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,106,0,0.1)]">
                                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Wed</span>
                                    <span className="text-sm font-bold text-primary leading-none mt-0.5">15</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white text-sm tracking-tight">Active Recovery</h4>
                                    <p className="text-xs text-slate-400 mt-1">Yoga & Mobility Routine</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-500 text-lg group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </div>
                        </Tilt>
                    </div>
                </motion.section>

                {/* Add completion functionality manually at bottom since mock cuts off */}
                <section className="pt-8 space-y-4">
                    <button
                        onClick={finishWorkout}
                        disabled={loading}
                        className="w-full bg-[#161616] hover:bg-[#222222] border border-white/5 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="material-symbols-outlined">done_all</span>}
                        {loading ? "Saving Progress..." : "Complete Workout Session"}
                    </button>
                </section>
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-24 w-full max-w-md px-6 z-40 flex justify-center pointer-events-none">
                <button
                    onClick={() => setIsCameraActive(!isCameraActive)}
                    className="bg-gradient-to-r from-primary to-[#ff8c00] text-white font-bold py-4 px-8 rounded-full shadow-[0_10px_30px_rgba(255,106,0,0.5)] flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 pointer-events-auto">
                    <Camera className="w-5 h-5" />
                    <span className="tracking-wide text-base">{isCameraActive ? "Stop Camera" : "Start Camera"}</span>
                </button>
            </div>

            {/* Global Navigation Bar */}
            <NavigationBar />
        </div>
    );
}
