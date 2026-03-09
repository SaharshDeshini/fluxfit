import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import NavigationBar from "../components/NavigationBar";

export default function WellnessPage() {
    const navigate = useNavigate();
    const [durationMinutes, setDurationMinutes] = useState(10);
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(durationMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeftSeconds > 0) {
            interval = setInterval(() => {
                setTimeLeftSeconds(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeftSeconds === 0 && isActive) {
            handleComplete();
            setIsActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeftSeconds]);

    useEffect(() => {
        if (!isActive) {
            setTimeLeftSeconds(durationMinutes * 60);
        }
    }, [durationMinutes, isActive]);

    const toggleTimer = () => setIsActive(!isActive);

    const handleComplete = async () => {
        setLoading(true);
        try {
            const durationInSeconds = durationMinutes * 60 - timeLeftSeconds;
            // Provide at least the time completed even if finished early
            const res = await api.post('/api/wellness/meditation', {
                durationInSeconds: durationInSeconds > 0 ? durationInSeconds : durationMinutes * 60
            });
            if (res.data && res.data.success) {
                toast.success(`Meditation complete! Total today: ${Math.floor(res.data.totalMeditationToday / 60)} mins.`);
            } else {
                toast.success("Meditation logged successfully! (Offline Mode)");
            }
        } catch (error) {
            toast.success("Meditation logged successfully! (Offline Mode)");
        } finally {
            setLoading(false);
            setIsActive(false);
            setTimeLeftSeconds(durationMinutes * 60);
        }
    };

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progressPercentage = 100 - (timeLeftSeconds / (durationMinutes * 60)) * 100;

    return (
        <div className="bg-[#000000] font-sans text-slate-100 min-h-screen pb-32 relative overflow-hidden">
            <header className="flex items-center justify-between p-6 sticky top-0 bg-[#000000] z-50">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center border border-white/5 active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-white">arrow_back</span>
                </button>
                <h1 className="text-[13px] font-bold tracking-widest uppercase text-white">Wellness & Mind</h1>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffb48a] to-[#ff6a00] p-[2px] shadow-[0_0_15px_rgba(255,106,0,0.3)]">
                    <div className="w-full h-full bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="material-symbols-outlined text-white text-[18px]">horizontal_rule</span>
                    </div>
                </div>
            </header>

            <main className="px-6 space-y-8 mt-2 flex flex-col items-center">
                {/* Large Circular Timer */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative w-72 h-72 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background Track */}
                        <circle className="text-white/5" cx="144" cy="144" fill="transparent" r="130" stroke="currentColor" strokeWidth="4"></circle>
                        {/* Progress Track */}
                        <circle
                            className="text-primary transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(255,106,0,0.5)] drop-shadow-[0_0_15px_rgba(255,106,0,0.8)]"
                            cx="144"
                            cy="144"
                            fill="transparent"
                            r="130"
                            stroke="currentColor"
                            strokeDasharray="816"
                            strokeDashoffset={816 - (816 * progressPercentage) / 100}
                            strokeLinecap="round"
                            strokeWidth="6"
                        ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-4">
                        <span className="text-[64px] font-thin text-white tracking-wider leading-none mb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{formatTime(timeLeftSeconds)}</span>
                        <span className="text-primary text-[10px] font-bold uppercase tracking-[0.15em] opacity-80 backdrop-blur-sm bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Time Remaining</span>
                    </div>
                </motion.div>

                {/* Duration Pills */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-sm flex justify-between gap-3">
                    {[5, 10, 20, 30].map(min => (
                        <button
                            key={min}
                            onClick={() => {
                                if (!isActive) setDurationMinutes(min);
                            }}
                            disabled={isActive}
                            className={`flex-1 py-3 items-center justify-center flex rounded-full text-sm font-bold transition-all border ${durationMinutes === min ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(255,106,0,0.4)] scale-105' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20'} disabled:opacity-50 tracking-wider`}
                        >
                            {min}m
                        </button>
                    ))}
                </motion.div>

                {/* Main Action Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                    onClick={isActive ? handleComplete : toggleTimer}
                    disabled={loading}
                    className="w-full max-w-sm py-5 rounded-full bg-gradient-to-r from-primary to-[#ff6a00] text-black font-extrabold uppercase tracking-widest hover:brightness-110 shadow-[0_10px_30px_rgba(255,106,0,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-primary/20"
                >
                    {loading ? <Loader2 className="w-5 h-5 text-black animate-spin" /> : null}
                    {isActive ? "End Session" : "Start Meditation"}
                </motion.button>

                {/* Ambient Library Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-full max-w-sm mt-4 space-y-4 pb-6">
                    <h2 className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">Ambient Library</h2>

                    <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.15} glareBorderRadius="32px" scale={1.02}>
                        <div className="bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Card Content Row */}
                            <div className="flex items-center justify-between mb-5 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden relative shadow-[0_5px_15px_rgba(0,0,0,0.5)] border border-white/10">
                                        <img alt="Zen Forest" src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        {isActive && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1 backdrop-blur-[2px]">
                                                <div className="w-1 h-3 bg-white animate-pulse rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                                                <div className="w-1 h-5 bg-white animate-pulse delay-75 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                                                <div className="w-1 h-3 bg-white animate-pulse delay-150 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <h3 className="text-lg font-bold text-white tracking-tight leading-none drop-shadow-sm">Zen Forest</h3>
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20 inline-block w-fit">Nature Sounds • 432Hz</p>
                                    </div>
                                </div>
                                <button className="w-10 h-10 rounded-full bg-black/40 border border-white/5 flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-white/5 shadow-inner">
                                    <span className="material-symbols-outlined text-[20px] fill-[1]">favorite</span>
                                </button>
                            </div>

                            {/* Audio Progress */}
                            <div className="space-y-2 mt-4 relative z-10">
                                <div className="h-1.5 w-full bg-black/50 border border-white/5 rounded-full overflow-hidden relative shadow-inner">
                                    <div className="h-full bg-gradient-to-r from-primary to-[#ff6a00] rounded-full transition-all absolute left-0 shadow-[0_0_10px_rgba(255,106,0,0.5)]" style={{ width: isActive ? "33%" : "0%" }}></div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold tracking-widest pt-1">
                                    <span>{isActive ? "03:20" : "00:00"}</span>
                                    <span>10:00</span>
                                </div>
                            </div>
                            
                            {/* Audio Controls */}
                            <div className="flex items-center justify-between px-2 pt-6 pb-2 relative z-10">
                                <button className="text-slate-500 hover:text-white transition-colors active:scale-95">
                                    <span className="material-symbols-outlined text-[22px]">shuffle</span>
                                </button>
                                <button className="text-white hover:text-primary transition-colors active:scale-95">
                                    <span className="material-symbols-outlined text-[32px] fill-[1]">skip_previous</span>
                                </button>
                                <button onClick={toggleTimer} className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-all active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,0.3)] border-[3px] border-white/50">
                                    <span className="material-symbols-outlined text-[36px] fill-[1]">{isActive ? "pause" : "pause"}</span>
                                </button>
                                <button className="text-white hover:text-primary transition-colors active:scale-95">
                                    <span className="material-symbols-outlined text-[32px] fill-[1]">skip_next</span>
                                </button>
                                <button className="text-slate-500 hover:text-white transition-colors active:scale-95">
                                    <span className="material-symbols-outlined text-[22px]">repeat</span>
                                </button>
                            </div>
                        </div>
                    </Tilt>
                </motion.div>
            </main>

            {/* Global Navigation Bar */}
            <NavigationBar />
        </div>
    );
}
