import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavigationBar from "../components/NavigationBar";

export default function NutritionPage() {
    const navigate = useNavigate();
    const [isVegetarian, setIsVegetarian] = useState(true);

    const vegMeals = [
        {
            type: "BREAKFAST",
            name: "Quinoa Buddha Bowl",
            calories: "450 kcal",
            description: "Rich in fiber and plant-based protein with roasted chickpeas and kale.",
            protein: "15g",
            carbs: "60g",
            fat: "12g",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop"
        },
        {
            type: "LUNCH",
            name: "Grilled Paneer Salad",
            calories: "380 kcal",
            description: "High protein paneer cubes grilled with Mediterranean spices and olive oil.",
            protein: "22g",
            carbs: "12g",
            fat: "28g",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop"
        },
        {
            type: "DINNER",
            name: "Spiced Lentil Stew",
            calories: "320 kcal",
            description: "A comforting bowl of slow-cooked lentils with turmeric and fresh coriander.",
            protein: "18g",
            carbs: "45g",
            fat: "4g",
            image: "https://images.unsplash.com/photo-1548943487-a2e4b43b4850?w=800&auto=format&fit=crop"
        }
    ];

    const nonVegMeals = [
        {
            type: "HIGH PROTEIN",
            name: "Grilled Salmon & Asparagus",
            calories: "450 kcal",
            description: "Atlantic salmon seasoned with herbs, served with lemon-butter asparagus.",
            protein: "35g",
            carbs: "5g",
            fat: "22g",
            image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&auto=format&fit=crop"
        },
        {
            type: "QUICK LUNCH",
            name: "Chicken Avocado Wrap",
            calories: "520 kcal",
            description: "Whole wheat tortilla packed with grilled chicken strips, creamy avocado, and greens.",
            protein: "42g",
            carbs: "38g",
            fat: "18g",
            image: "https://images.unsplash.com/photo-1626844131082-256783844137?w=800&auto=format&fit=crop"
        },
        {
            type: "LEAN & CLEAN",
            name: "Turkey Breast & Greens",
            calories: "380 kcal",
            description: "Slow-roasted turkey breast served over a bed of spinach, kale, and toasted almonds.",
            protein: "48g",
            carbs: "8g",
            fat: "12g",
            image: "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=800&auto=format&fit=crop"
        }
    ];

    const activeMeals = isVegetarian ? vegMeals : nonVegMeals;

    return (
        <div className="bg-[#050505] font-sans text-slate-100 min-h-screen pb-40 relative">
            {/* Header Section */}
            <header className="flex items-center justify-between p-6 sticky top-0 bg-[#050505]/95 backdrop-blur-md z-50 pt-10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff6a00] text-3xl">restaurant</span>
                    <h1 className="text-[19px] font-bold tracking-tight text-white flex items-center gap-1">
                        Nutrition <span className="text-[#ff6a00] text-[18px]">&</span> Diet
                    </h1>
                </div>
                <button className="w-[38px] h-[38px] rounded-full bg-[#181818] flex items-center justify-center relative shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                    <span className="material-symbols-outlined text-white text-[20px] fill-[1]">notifications</span>
                    <span className="absolute top-[8px] right-[10px] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"></span>
                </button>
            </header>

            <main className="px-5 space-y-7 mt-2">
                {/* Diet Type Toggle */}
                <div className="bg-[#121212] p-1.5 rounded-[18px] flex mx-auto max-w-[340px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                    <button 
                        onClick={() => setIsVegetarian(true)}
                        className={`flex-1 py-2.5 rounded-[14px] text-[13px] font-bold transition-all duration-300 ${isVegetarian ? 'bg-[#ff6a00] text-white shadow-[0_4px_12px_rgba(255,106,0,0.4)]' : 'text-slate-400 hover:text-white'}`}
                    >
                        Veg
                    </button>
                    <button 
                        onClick={() => setIsVegetarian(false)}
                        className={`flex-1 py-2.5 rounded-[14px] text-[13px] font-bold transition-all duration-300 ${!isVegetarian ? 'bg-[#ff6a00] text-white shadow-[0_4px_12px_rgba(255,106,0,0.4)]' : 'text-[#666] hover:text-slate-300'}`}
                    >
                        Non-Veg
                    </button>
                </div>

                {/* Today's Meal Plan Header */}
                <div className="flex items-center justify-between pt-3 pb-1">
                    <h2 className="text-[19px] font-bold text-white tracking-wide">Recommended Meals</h2>
                    <button className="text-[#ff6a00] text-[12px] font-bold tracking-wide">
                        View All
                    </button>
                </div>

                {/* Meal Cards */}
                <div className="space-y-6">
                    {activeMeals.map((meal, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                            className="bg-[#0f0f0f] border border-[#222] shadow-[0_8px_20px_rgba(0,0,0,0.6)] rounded-[24px] flex flex-col group relative"
                        >
                            <div className="h-[200px] w-full relative -mt-0">
                                <img src={meal.image} alt={meal.name} className="w-full h-full object-cover rounded-t-[24px]" />
                                <div className="absolute top-4 right-4 bg-[#2a2a2a]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-black text-[#ff6a00] tracking-widest uppercase shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
                                    {meal.type}
                                </div>
                            </div>
                            
                            <div className="p-6 flex flex-col gap-3.5">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-[18px] font-bold text-white leading-tight">{meal.name}</h3>
                                    <span className="text-[#ff6a00] font-bold text-[14px] whitespace-nowrap">{meal.calories}</span>
                                </div>
                                <p className="text-[#777] text-[13px] leading-relaxed pr-6 mt-0.5">
                                    {meal.description}
                                </p>
                                
                                <div className="flex items-end justify-between mt-3">
                                    <div className="flex items-center gap-7">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1.5">Protein</span>
                                            <span className="text-white font-bold text-[15px]">{meal.protein}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1.5">Carbs</span>
                                            <span className="text-white font-bold text-[15px]">{meal.carbs}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1.5">Fats</span>
                                            <span className="text-white font-bold text-[15px]">{meal.fat}</span>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2 rounded-full bg-[#ff6a00] text-white text-[13px] font-bold shadow-[0_4px_10px_rgba(255,106,0,0.3)] transition-transform hover:scale-105 active:scale-95 shrink-0">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Search Bar Floating */}
            <div className="fixed bottom-[90px] w-full max-w-md px-5 z-40 flex items-center gap-3">
                <div className="flex-1 bg-[#161616] border border-[#222] rounded-[18px] px-4 py-3.5 flex items-center gap-3 shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                    <span className="material-symbols-outlined text-[#555] text-[20px]">search</span>
                    <input 
                        type="text"
                        placeholder="Search for recipes or ingredients..."
                        className="bg-transparent border-none outline-none w-full text-[13.5px] text-white placeholder:text-[#666] font-medium"
                    />
                </div>
                <button className="w-[48px] h-[48px] rounded-[16px] bg-[#ff6a00] flex items-center justify-center shadow-[0_8px_20px_rgba(255,106,0,0.4)] shrink-0 transition-transform active:scale-95">
                    <span className="material-symbols-outlined text-white text-[22px]">tune</span>
                </button>
            </div>

            {/* Global Navigation Bar */}
            <NavigationBar />
        </div>
    );
}
