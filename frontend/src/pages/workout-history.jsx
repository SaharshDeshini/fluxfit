import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import NavigationBar from "../components/NavigationBar";

export default function WorkoutHistoryPage() {
    const navigate = useNavigate();

    return (
        <div className="bg-[#000000] font-sans text-slate-100 min-h-screen pb-32 relative">
            {/* Header Section */}
            <header className="flex items-center p-6 sticky top-0 bg-[#000000] z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-[#12141a] flex items-center justify-center border border-white/5 shadow-sm text-slate-300 transition-transform active:scale-95"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-xl font-bold tracking-wide text-white pr-10">
                    Workout History
                </h1>
            </header>

            <main className="px-6 space-y-8 flex flex-col mt-2">
                {/* Weekly Summary Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">
                            Weekly Summary
                        </h2>
                        <span className="text-primary text-xs font-bold">Oct 23 - Oct 29</span>
                    </div>

                    <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="24px" scale={1.02}>
                        <div className="w-full grid grid-cols-3 gap-3 p-3 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-[110px] shadow-inner">
                                <span className="material-symbols-outlined text-primary text-[24px]">fitness_center</span>
                                <div>
                                    <div className="text-2xl font-bold text-white tracking-tight leading-none mb-1">12</div>
                                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">Workouts</div>
                                </div>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-[110px] shadow-inner">
                                <span className="material-symbols-outlined text-primary text-[24px]">schedule</span>
                                <div>
                                    <div className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
                                        8.5<span className="text-sm text-slate-500">h</span>
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">Active Time</div>
                                </div>
                            </div>
                            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex flex-col justify-between h-[110px] shadow-[0_0_15px_rgba(255,106,0,0.1)]">
                                <span className="material-symbols-outlined text-primary text-[24px]">local_fire_department</span>
                                <div>
                                    <div className="text-2xl font-bold text-primary tracking-tight leading-none mb-1">
                                        4.2<span className="text-sm text-primary/70">k</span>
                                    </div>
                                    <div className="text-[9px] text-primary font-bold uppercase tracking-[0.1em]">Calories</div>
                                </div>
                            </div>
                        </div>
                    </Tilt>
                </motion.div>

                {/* Today */}
                {/* Today */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-4 pt-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">Today</h3>
                    <Tilt className="parallax-effect" perspective={500} glareEnable={true} glareMaxOpacity={0.15} glareBorderRadius="28px" scale={1.02} transitionSpeed={1000}>
                        <div className="bg-white/5 rounded-[28px] p-5 flex items-center justify-between border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="flex items-center gap-4 w-full relative z-10">
                                <div className="w-[72px] h-[72px] rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                                    <span className="material-symbols-outlined text-primary text-[32px] fill-[1]">fitness_center</span>
                                </div>
                                <div className="flex flex-col flex-1 gap-1.5">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[17px] font-bold text-white tracking-tight leading-tight">Heavy Leg Day</span>
                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(255,106,0,0.2)]">
                                            High Intensity
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            <span>1h 15m</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                            <span>450 kcal</span>
                                        </div>
                                    </div>
                                    <button className="mt-1 flex items-center gap-1 text-primary text-[11px] font-bold uppercase tracking-widest hover:text-orange-400 transition-colors">
                                        View Details
                                        <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Tilt>
                </motion.div>

                {/* Yesterday */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-4 pt-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">Yesterday</h3>
                    <Tilt className="parallax-effect" perspective={500} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="28px" scale={1.02} transitionSpeed={1000}>
                        <div className="bg-white/5 rounded-[28px] p-5 flex items-center justify-between border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="flex items-center gap-4 w-full relative z-10">
                                <div className="w-[72px] h-[72px] rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                                    <span className="material-symbols-outlined text-primary text-[32px] fill-[1]">fitness_center</span>
                                </div>
                                <div className="flex flex-col flex-1 gap-1.5">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[17px] font-bold text-white tracking-tight leading-tight">Full Body Strength</span>
                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 border border-white/20">
                                            Medium
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            <span>55m</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                            <span>320 kcal</span>
                                        </div>
                                    </div>
                                    <button className="mt-1 flex items-center gap-1 text-primary text-[11px] font-bold uppercase tracking-widest hover:text-orange-400 transition-colors">
                                        View Details
                                        <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Tilt>
                </motion.div>

                {/* Specific Date */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-4 pt-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">October 25</h3>
                    <Tilt className="parallax-effect" perspective={500} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="28px" scale={1.02} transitionSpeed={1000}>
                        <div className="bg-white/5 rounded-[28px] p-5 flex items-center justify-between border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="flex items-center gap-4 w-full relative z-10">
                                <div className="w-[72px] h-[72px] rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                                    <span className="material-symbols-outlined text-green-500 text-[32px] fill-[1]">self_improvement</span>
                                </div>
                                <div className="flex flex-col flex-1 gap-1.5">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[17px] font-bold text-white tracking-tight leading-tight">Morning Yoga</span>
                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                                            Low
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            <span>45m</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                            <span>150 kcal</span>
                                        </div>
                                    </div>
                                    <button className="mt-1 flex items-center gap-1 text-primary text-[11px] font-bold uppercase tracking-widest hover:text-orange-400 transition-colors">
                                        View Details
                                        <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
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
