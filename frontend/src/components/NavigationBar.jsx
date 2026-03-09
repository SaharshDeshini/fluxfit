import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Utensils, Calendar, Settings, User } from "lucide-react";

export default function NavigationBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { name: "Home", path: "/dashboard", icon: "home" },
        { name: "Workouts", path: "/workout", icon: "fitness_center" },
        { name: "Nutrition", path: "/nutrition", icon: "restaurant" },
        { name: "Profile", path: "/profile", icon: "person" }
    ];

    return (
        <nav className="fixed bottom-0 w-full max-w-md z-[100] bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 px-6 pt-2 pb-6 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            {tabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                    <button
                        key={tab.path}
                        onClick={() => navigate(tab.path)}
                        className={`flex flex-col items-center gap-1 transition-colors bg-transparent border-none w-16 relative ${isActive ? "text-[#FF6B00] opacity-100" : "text-slate-500 hover:text-white"}`}
                    >
                        <span className={`material-symbols-outlined text-[24px] ${isActive ? "fill-[1]" : ""}`}>
                            {tab.icon}
                        </span>
                        <span className={`text-[10px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                            {tab.name}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
