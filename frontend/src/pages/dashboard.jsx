import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import NavigationBar from "../components/NavigationBar";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, profile } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        workout: null,
        diet: null
    });

    useEffect(() => {
        if (!user && !useAuthStore.getState().loading) {
            navigate("/login");
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const workoutRes = await api.get('/api/workout/today').catch(() => ({ data: null }));
                const dietRes = await api.get('/api/diet/active').catch(() => ({ data: null }));

                setDashboardData({
                    workout: workoutRes.data,
                    diet: dietRes.data
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user, navigate]);

    // Check if the user's Firebase document has an attached generated workout plan
    const generatedPlan = profile?.active_program;

    return (
        <div className="bg-[#0a0a0a] text-slate-100 min-h-screen flex flex-col font-sans mb-10 pb-24 relative overflow-x-hidden">
            {/* Header Section */}
            <header className="flex items-center justify-between p-6 pt-8 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-40 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border border-primary/30 p-0.5 relative overflow-hidden bg-[#161616]">
                            <img alt="User Profile" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACrA2T1IIwTJ8nzfyLeD71H1FghF-LznKZK17FnWxNsJoVup6KR9rGuvKQtRI0g3BvtqFzdLS5dYg1zeJ8nnCf78FvOUna5qrqdPB6aC1DShChCpyIZaIYAjdVb7oHWpS2p01i8YMdTzkCTnBPo0VPS0WK-9ULL4BFweaX1hhgaft-ncxGEGrdJc7x8BThHhxDzWGZroLcPZxeUj-rIX1NUuHUYssngmpV9JLlhWad5pAbm4G0FGnFDmKSGCnx0U-TY__9lo_llSE" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full"></div>
                    </div>
                    <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Good Morning</p>
                        <h1 className="text-xl font-bold tracking-tight text-white">{profile?.name || "Athlete"}</h1>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-[#12141a] flex items-center justify-center border border-white/5 shadow-sm text-slate-300 transition-transform active:scale-95">
                    <span className="material-symbols-outlined text-[20px] fill-[1]">notifications</span>
                </button>
            </header>

            <main className="flex-1 px-5 space-y-6 mt-6 max-w-md mx-auto w-full">

                {/* Empty Plan Block */}
                {!dashboardData.workout && !generatedPlan && (
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Tilt 
                            className="parallax-effect" 
                            perspective={500} 
                            glareEnable={true} 
                            glareMaxOpacity={0.3} 
                            glareColor="rgba(255,106,0,0.4)" 
                            glarePosition="all" 
                            glareBorderRadius="24px" 
                            scale={1.02} 
                            transitionSpeed={1500}
                        >
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                <h2 className="text-xl font-bold tracking-tight text-white mb-2">No Active Program</h2>
                                <p className="text-sm text-slate-400">Head over to the Onboarding Flow to let our AI build you a personalized 14-day schedule!</p>
                            </div>
                        </Tilt>
                    </motion.section>
                )}

                {generatedPlan && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div>
                                <h1 className="text-[20px] font-bold tracking-tight text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-indigo-400 text-xl">auto_awesome</span>
                                    {generatedPlan.program.name}
                                </h1>
                                <p className="text-xs text-slate-400 mt-1">{generatedPlan.program.description}</p>
                            </div>
                        </div>

                        {/* Rendering the scheduled routines dynamically */}
                        <div className="space-y-3">
                            {generatedPlan.program_routine.map((scheduleRef, idx) => {
                                // Find the actual routine detail
                                const routine = generatedPlan.routine.find(r => r.id === scheduleRef.routine_id);
                                if (!routine) return null;

                                // Parse the Date
                                const dateObj = new Date(scheduleRef.scheduled_date + "T00:00:00");
                                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                                const dayNum = dateObj.getDate();

                                // Is this today's workout? (First one in loop for demo purposes)
                                const isToday = idx === 0;

                                return (
                                    <div key={scheduleRef.routine_id + idx} className={`flex items-start gap-4 p-4 rounded-2xl relative border ${isToday ? 'bg-[#241100]/80 border-primary shadow-[0_0_15px_rgba(255,106,0,0.1)]' : 'bg-[#121212] border-white/5 cursor-pointer'}`}>
                                        <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center shrink-0 border ${isToday ? 'bg-[#2c1a0e] border-primary/20 text-primary' : 'bg-[#1a1c23] border-white/5 text-slate-400'}`}>
                                            <span className="text-[9px] font-bold uppercase tracking-widest">{dayName}</span>
                                            <span className="text-sm font-bold leading-none mt-0.5">{dayNum}</span>
                                        </div>
                                        <div className="flex-1 mt-0.5">
                                            <h4 className={`font-bold text-sm ${isToday ? 'text-white' : 'text-slate-200'}`}>{routine.name}</h4>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{routine.description}</p>
                                            <div className="flex gap-3 mt-3">
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span className="material-symbols-outlined text-[12px]">timer</span>
                                                    {(routine.duration / 60000).toFixed(0)}m
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                                                    {routine.estimated_calories || 250} kcal
                                                </span>
                                            </div>
                                        </div>
                                        {isToday && (
                                            <button onClick={() => navigate('/workout')} className="h-10 w-10 shrink-0 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,106,0,0.4)] absolute right-4 top-1/2 -translate-y-1/2 transition-transform hover:scale-105 active:scale-95">
                                                <span className="material-symbols-outlined text-[20px] ml-0.5">play_arrow</span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Legacy Active Session Card */}
                {dashboardData.workout && !generatedPlan && (
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Tilt 
                            className="parallax-effect" 
                            perspective={500} 
                            glareEnable={true} 
                            glareMaxOpacity={0.4} 
                            glareColor="rgba(255,106,0,0.5)" 
                            glarePosition="all" 
                            glareBorderRadius="28px" 
                            scale={1.02} 
                            transitionSpeed={1500}
                            tiltMaxAngleX={10}
                            tiltMaxAngleY={10}
                        >
                            <div className="rounded-[28px] overflow-hidden relative group bg-white/5 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-white/10">
                                <div className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>

                                <div className="relative p-6 flex flex-col gap-6 z-10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="px-3 py-1 bg-primary/20 text-primary text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border border-primary/30 backdrop-blur-md shadow-[0_0_15px_rgba(255,106,0,0.3)]">Active Session</span>
                                            <h2 className="text-[22px] font-bold mt-3 text-white tracking-tight drop-shadow-md">Heavy Leg Day</h2>
                                            <p className="text-slate-300 text-xs font-medium mt-1">Session started 45m ago</p>
                                        </div>
                                        <div className="bg-black/40 backdrop-blur-xl px-3 py-2 rounded-[14px] border border-white/10 shadow-lg flex flex-col items-center">
                                            <span className="text-white text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">COMPLETED</span>
                                            <span className="text-primary font-bold text-lg">45%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <div className="flex justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                                            <span>In Progress</span>
                                            <span>8 of 14 sets</span>
                                        </div>
                                        <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 backdrop-blur-md shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-[#ff8c42] to-primary rounded-full relative" style={{ width: "45%" }}>
                                                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 rounded-full blur-[2px]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/workout')}
                                        className="w-full bg-gradient-to-r from-primary to-[#ff4e00] text-white font-bold py-3.5 rounded-[16px] flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-[0_0_20px_rgba(255,106,0,0.4)] mt-2"
                                    >
                                        <span className="material-symbols-outlined text-[20px] fill-[1]">play_arrow</span>
                                        RESUME WORKOUT
                                    </button>
                                </div>
                            </div>
                        </Tilt>
                    </motion.section>
                )}

                {/* Quick Actions / Shortcuts Row */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-2 gap-4"
                >
                    {/* Wellness Redirect Card */}
                    <Tilt className="h-full" perspective={500} glareEnable={true} glareMaxOpacity={0.2} glareBorderRadius="24px" scale={1.03}>
                        <button
                            onClick={() => navigate('/wellness')}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 flex flex-col items-start justify-between h-36 relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.3)] text-left w-full cursor-pointer before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none"
                        >
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors"></div>
                            <div className="w-10 h-10 rounded-full bg-[#1a110a] flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(255,106,0,0.2)] relative z-10">
                                <span className="material-symbols-outlined text-primary text-[20px] fill-[1]">self_improvement</span>
                            </div>
                            <div className="relative z-10 mt-auto">
                                <h3 className="text-[15px] font-bold text-white tracking-tight">Mind & Wellness</h3>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">Meditate & recover</p>
                            </div>
                        </button>
                    </Tilt>

                    {/* Diet Redirect Card */}
                    <Tilt className="h-full" perspective={500} glareEnable={true} glareMaxOpacity={0.2} glareBorderRadius="24px" scale={1.03}>
                        <button
                            onClick={() => navigate('/diet-dashboard')}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 flex flex-col items-start justify-between h-36 relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.3)] text-left w-full cursor-pointer before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none"
                        >
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/20 rounded-full blur-2xl group-hover:bg-green-500/30 transition-colors"></div>
                            <div className="w-10 h-10 rounded-full bg-[#0a1a11] flex items-center justify-center border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)] relative z-10">
                                <span className="material-symbols-outlined text-green-500 text-[20px] fill-[1]">restaurant_menu</span>
                            </div>
                            <div className="relative z-10 mt-auto">
                                <h3 className="text-[15px] font-bold text-white tracking-tight">Diet Dashboard</h3>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">Track & customize</p>
                            </div>
                        </button>
                    </Tilt>
                </motion.section>

                {/* Workout Analytics Compact */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-3 pb-4"
                >
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-[17px] font-bold tracking-tight text-white">This Week</h2>
                        <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:text-orange-400 transition-colors">View All</button>
                    </div>

                    <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.15} glareBorderRadius="24px" scale={1.01}>
                        <div className="bg-white/5 backdrop-blur-xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] rounded-[24px] p-5 border border-white/10 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none relative overflow-hidden">
                            <div className="grid grid-cols-4 gap-2 text-white relative z-10">
                                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                                    <span className="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
                                    <span className="text-[13px] font-bold">1.2k</span>
                                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Kcal</span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                                    <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
                                    <span className="text-[13px] font-bold">5.2h</span>
                                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Time</span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                                    <span className="material-symbols-outlined text-primary text-[18px]">favorite</span>
                                    <span className="text-[13px] font-bold">142</span>
                                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Avg HR</span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-primary/10 border border-primary/20 relative overflow-hidden shadow-[0_0_15px_rgba(255,106,0,0.15)] inner-shadow">
                                    <div className="absolute inset-0 bg-primary/5"></div>
                                    <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                                    <span className="text-[13px] font-bold text-primary relative">14</span>
                                    <span className="text-[8px] text-primary font-bold uppercase tracking-wider relative">Days</span>
                                </div>
                            </div>
                        </div>
                    </Tilt>
                </motion.section>
            </main>

            {/* Global Navigation Bar */}
            <NavigationBar />
        </div>
    );
}
