import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { auth } from "../lib/firebase";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import NavigationBar from "../components/NavigationBar";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, profile, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="bg-[#000000] font-sans text-slate-100 min-h-screen pb-32 relative">
            {/* Header Section */}
            <header className="flex items-center justify-between p-6 sticky top-0 bg-[#000000] z-50">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[28px] fill-[1]">bolt</span>
                    <h1 className="text-xl font-bold tracking-widest text-white">FLUXFIT</h1>
                </div>
                <button className="w-10 h-10 rounded-full bg-[#12141a] flex items-center justify-center border border-white/5 shadow-sm text-slate-300 transition-transform active:scale-95">
                    <span className="material-symbols-outlined text-[20px] fill-[1]">settings</span>
                </button>
            </header>

            <main className="px-6 space-y-8 flex flex-col items-center mt-2">
                {/* Profile Identity */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4">
                    <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.2} glareBorderRadius="100%" scale={1.05}>
                        <div className="w-28 h-28 rounded-full border-[3px] border-primary p-1 shadow-[0_0_20px_rgba(255,106,0,0.5)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-full blur-md"></div>
                            <div className="w-full h-full rounded-full overflow-hidden bg-black/80 relative z-10 border border-white/10">
                                <img alt="User" className="w-full h-full object-cover" src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuCHXbB_T4eYg8xXj4wD24qN5pU9nO8gC0_tqL5JpZ2Xf7xN9iUuI5tO3vL1XyA2xO9wK8jQ1aN8sN6xX5tQ4bP2zJ7xU9sO6vF1mN9lW5xK3zJ7xC1tQ8vF0wE6lN8vX9yD0wE6rN9hW1tL8wP5zJ7xC1kM4yP2oT4uP6vF1mN9lW5xK3zJ7xC1tQ8vF0wE6lN8vX9yD0wE6rN9hW1tL8wP5zJ7xC1"} />
                            </div>
                        </div>
                    </Tilt>
                    <div className="text-center">
                        <h2 className="text-[22px] font-bold text-white tracking-tight leading-tight drop-shadow-md">{profile?.firstName || user?.displayName || "Alex Rivera"}</h2>
                        <span className="text-primary text-[10px] font-bold tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20 inline-block mt-1 shadow-[0_0_10px_rgba(255,106,0,0.2)]">Elite Member since 2023</span>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full grid grid-cols-3 gap-3">
                    <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="24px" scale={1.03}>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl py-4 flex flex-col items-center justify-center shadow-lg h-full">
                            <span className="text-white text-xl font-bold tracking-tight">128</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-1">Workouts</span>
                        </div>
                    </Tilt>
                    <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="24px" scale={1.03}>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl py-4 flex flex-col items-center justify-center shadow-lg h-full">
                            <span className="text-white text-xl font-bold tracking-tight">42k</span>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-1">Calories</span>
                        </div>
                    </Tilt>
                    <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.2} glareColor="rgba(255,106,0,0.2)" glareBorderRadius="24px" scale={1.03}>
                        <div className="bg-primary/10 backdrop-blur-xl border border-primary/30 rounded-3xl py-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(255,106,0,0.15)] relative overflow-hidden h-full">
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
                            <span className="text-primary text-xl font-bold tracking-tight relative drop-shadow-[0_0_5px_rgba(255,106,0,0.5)]">14</span>
                            <span className="text-[8px] text-primary/80 font-bold uppercase tracking-[0.15em] mt-1 relative">Day Streak</span>
                        </div>
                    </Tilt>
                </motion.div>

                {/* Community Button */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full">
                    <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="24px" scale={1.02}>
                        <button
                            onClick={() => navigate('/community')}
                            className="w-full bg-white/5 backdrop-blur-xl rounded-3xl p-4 flex items-center justify-between border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.3)] group active:scale-[0.98] transition-all hover:border-white/20"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-black/40 shadow-inner flex items-center justify-center border border-white/5">
                                    <span className="material-symbols-outlined text-primary text-[20px] fill-[1] group-hover:scale-110 transition-transform">groups</span>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[15px] font-bold text-white tracking-tight">Community</span>
                                    <span className="text-[11px] text-slate-400 font-medium">Connect with friends & share progress</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-500 text-[20px] mr-2 transition-transform group-hover:translate-x-1">chevron_right</span>
                        </button>
                    </Tilt>
                </motion.div>

                {/* Workout History Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="w-full space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white tracking-tight">Workout History</h3>
                        <button
                            onClick={() => navigate('/workout-history')}
                            className="text-primary text-[10px] font-bold uppercase tracking-widest hover:text-orange-400 transition-colors bg-transparent border-none"
                        >
                            See All
                        </button>
                    </div>

                    <div className="space-y-3">
                        <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.05} glareBorderRadius="24px" scale={1.01}>
                            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 flex items-center justify-between border border-white/10 shadow-lg group hover:border-white/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-black/40 shadow-inner flex items-center justify-center border border-white/5">
                                        <span className="material-symbols-outlined text-primary text-[20px] fill-[1]">fitness_center</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[15px] font-bold text-white tracking-tight">Heavy Leg Day</span>
                                        <span className="text-[11px] text-slate-400 font-medium">Yesterday • 72 mins</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-500 text-[20px] mr-2 transition-transform group-hover:translate-x-1">chevron_right</span>
                            </div>
                        </Tilt>

                        <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.05} glareBorderRadius="24px" scale={1.01}>
                            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 flex items-center justify-between border border-white/10 shadow-lg group hover:border-white/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-black/40 shadow-inner flex items-center justify-center border border-white/5">
                                        <span className="material-symbols-outlined text-primary text-[20px] fill-[1]">self_improvement</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[15px] font-bold text-white tracking-tight">Morning Yoga</span>
                                        <span className="text-[11px] text-slate-400 font-medium">Oct 24 • 45 mins</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-500 text-[20px] mr-2 transition-transform group-hover:translate-x-1">chevron_right</span>
                            </div>
                        </Tilt>
                    </div>
                </motion.div>

                {/* Action Menu (Glassmorphism Stack) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-full pt-4 flex flex-col bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-xl overflow-hidden divide-y divide-white/10">
                    <button className="flex items-center gap-4 bg-transparent py-5 px-6 text-left hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined text-primary text-[24px]">payments</span>
                        <span className="text-sm font-bold text-white tracking-wide flex-1">Subscription Plan</span>
                        <span className="material-symbols-outlined text-slate-600 text-[20px] transition-transform group-hover:translate-x-1">chevron_right</span>
                    </button>
                    <button className="flex items-center gap-4 bg-transparent py-5 px-6 text-left hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined text-primary text-[24px]">shield</span>
                        <span className="text-sm font-bold text-white tracking-wide flex-1">Privacy & Safety</span>
                        <span className="material-symbols-outlined text-slate-600 text-[20px] transition-transform group-hover:translate-x-1">chevron_right</span>
                    </button>
                    <button className="flex items-center gap-4 bg-transparent py-5 px-6 text-left hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined text-primary text-[24px]">help</span>
                        <span className="text-sm font-bold text-white tracking-wide flex-1">Support Center</span>
                        <span className="material-symbols-outlined text-slate-600 text-[20px] transition-transform group-hover:translate-x-1">chevron_right</span>
                    </button>
                </motion.div>

                {/* Logout Button */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="w-full mt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full py-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg hover:bg-red-500/20 text-red-500"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Logout Account</span>
                    </button>
                </motion.div>
            </main>

            {/* Global Navigation Bar */}
            <NavigationBar />
        </div>
    );
}
