import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDietStore } from "../store/dietStore";
import { Loader2, Search, Zap, LayoutDashboard, Utensils, Calendar, Settings, User } from "lucide-react";
import { toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import NavigationBar from "../components/NavigationBar";

const CircularProgress = ({ value, label, amount, color }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="flex-1 bg-[#0b101a] border border-[#1a2235] rounded-3xl py-5 px-2 flex flex-col items-center shadow-lg">
            <div className="relative w-[52px] h-[52px] flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="26" cy="26" r={radius} stroke="#1a2235" strokeWidth="4" fill="transparent" />
                    <circle cx="26" cy="26" r={radius} stroke={color} strokeWidth="4" fill="transparent"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                </svg>
                <span className="absolute text-[11px] leading-none font-bold text-white">{value}%</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 mb-1">{label}</span>
            <span className="text-[15px] font-bold text-white">{amount}g</span>
        </div>
    );
};

export default function DietDashboardPage() {
    const navigate = useNavigate();
    const { todaysDiet, targets, currentMacros, overwriteDiet } = useDietStore();

    const [filter, setFilter] = useState("VEG"); // VEG or NON-VEG
    const [searchQuery, setSearchQuery] = useState("");

    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);

    // Hardcoded recommended meals for Veg
    const vegMeals = [
        { id: "v1", title: "Quinoa Salad", calories: 320, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop" },
        { id: "v2", title: "Lentil Soup", calories: 280, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" },
        { id: "v3", title: "Tofu Stir-fry", calories: 350, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop" },
        { id: "v4", title: "Avo Toast", calories: 210, image: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=400&auto=format&fit=crop" },
        { id: "v5", title: "Green Bowl", calories: 290, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400&auto=format&fit=crop" },
        { id: "v6", title: "Chickpea Mix", calories: 310, image: "https://images.unsplash.com/photo-1505253668822-42074d58a7c6?q=80&w=400&auto=format&fit=crop" }
    ];

    // Hardcoded recommended meals for Non-Veg
    const nonVegMeals = [
        { id: "nv1", title: "Grilled Salmon", calories: 450, image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?q=80&w=400&auto=format&fit=crop" },
        { id: "nv2", title: "Chicken Breast", calories: 320, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&auto=format&fit=crop" },
        { id: "nv3", title: "Turkey Wrap", calories: 280, image: "https://images.unsplash.com/photo-1626804533033-66b97b0a7bea?q=80&w=400&auto=format&fit=crop" },
        { id: "nv4", title: "Beef Steak", calories: 510, image: "https://images.unsplash.com/photo-1574969446059-4d69bc5bf09c?q=80&w=400&auto=format&fit=crop" },
        { id: "nv5", title: "Tuna Salad", calories: 210, image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=400&auto=format&fit=crop" },
        { id: "nv6", title: "Shrimp Bowl", calories: 340, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop" }
    ];

    // Initial fetch based on filter type, mimicking "Recommended Meals"
    useEffect(() => {
        setLoading(true);
        // Simulate a tiny delay for smooth UI transition
        const timer = setTimeout(() => {
            if (filter === "VEG") {
                setFoodItems(vegMeals);
            } else {
                setFoodItems(nonVegMeals);
            }
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [filter]);

    const handleSearch = async (e) => {
        if (e.key !== 'Enter' || !searchQuery.trim()) return;

        const isAiPrompt = searchQuery.length > 20 || searchQuery.toLowerCase().includes("give me") || searchQuery.toLowerCase().includes("plan");

        if (isAiPrompt) {
            await handleAiGeneration();
        } else {
            setLoading(true);
            try {
                let url = `/food-api/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&search_simple=1&action=process&json=1&page_size=6`;
                if (filter === "VEG") {
                    url += "&tagtype_0=labels&tag_contains_0=contains&tag_0=vegetarian";
                }
                const res = await fetch(url);
                const data = await res.json();

                if (data.products) {
                    const mapped = data.products
                        .filter(p => p.product_name && p.image_url)
                        .map(p => ({
                            id: p.id || Math.random().toString(),
                            title: p.product_name,
                            calories: p.nutriments['energy-kcal_100g'] ? Math.round(p.nutriments['energy-kcal_100g']) : 0,
                            image: p.image_url,
                        })).slice(0, 6);
                    setFoodItems(mapped);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAiGeneration = async () => {
        setAiGenerating(true);
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        try {
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `You are FluxFit, a premium nutrition coach. The user requested: "${searchQuery}".
            Generate a JSON array of precisely 6 meal items that fit this request. 
            Format strictly as:
            [
              {"id": "unique_string", "title": "Food Name", "calories": 400, "image": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400&auto=format&fit=crop"}
            ]
            Respond with ONLY the raw JSON array, nothing else.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            let jsonText = response.text.replace(/\x60{3}json/g, '').replace(/\x60{3}/g, '').trim();
            const aiMeals = JSON.parse(jsonText);
            setFoodItems(aiMeals);
            
            toast.success("FluxFit generated custom meals!");
            setSearchQuery("");
        } catch (error) {
            console.error("AI Generation failed:", error);
            toast.error("Failed to generate AI meals.");
        } finally {
            setAiGenerating(false);
        }
    };

    const carbsPercentage = targets.carbs > 0 ? Math.min(Math.round((currentMacros.carbs / targets.carbs) * 100), 100) : 0;
    const proteinPercentage = targets.protein > 0 ? Math.min(Math.round((currentMacros.protein / targets.protein) * 100), 100) : 0;
    const fatsPercentage = targets.fats > 0 ? Math.min(Math.round((currentMacros.fats / targets.fats) * 100), 100) : 0;

    return (
        <div className="bg-[#030303] font-sans text-slate-100 min-h-screen pb-24 select-none relative">
            {/* Header */}
            <header className="flex items-center justify-between p-6">
                <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-[#FF6B00] fill-[#FF6B00]" />
                    <span className="text-[22px] font-bold text-white tracking-tight">FluxFit</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#111623] border border-white/5 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-300" />
                </div>
            </header>

            <main className="px-6 space-y-7">
                {/* Daily Progress Section */}
                <div>
                    <h2 className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-1">Daily Progress</h2>
                    <div className="flex justify-between items-end mb-6">
                        <h1 className="text-[34px] font-bold text-white leading-[1.1] tracking-tight">Today's<br/>Intake</h1>
                        <div className="text-right pb-1">
                            <span className="text-[#FF6B00] text-[22px] font-bold">{currentMacros.calories?.toLocaleString() || "1,625"}</span>
                            <span className="text-slate-400 text-sm font-medium ml-1">/ {targets.calories?.toLocaleString() || "2,500"}</span>
                            <div className="text-slate-500 text-xs font-medium mt-0.5 mb-1">kcal</div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <CircularProgress 
                            value={carbsPercentage || 60} 
                            label="Carbs" 
                            amount={currentMacros.carbs || 150} 
                            color="#FF6B00" 
                        />
                        <CircularProgress 
                            value={proteinPercentage || 80} 
                            label="Protein" 
                            amount={currentMacros.protein || 80} 
                            color="#e2e8f0" 
                        />
                        <CircularProgress 
                            value={fatsPercentage || 45} 
                            label="Fats" 
                            amount={currentMacros.fats || 60} 
                            color="#FF6B00" 
                        />
                    </div>
                </div>

                {/* Veg/Non-Veg Toggle */}
                <div className="bg-[#0b101a] p-1.5 rounded-full flex my-2">
                    <button
                        onClick={() => setFilter("VEG")}
                        className={`flex-1 py-3.5 text-[15px] font-bold tracking-wide rounded-full transition-all duration-300 ${filter === "VEG" ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20" : "text-slate-400 hover:text-white"}`}
                    >
                        Veg
                    </button>
                    <button
                        onClick={() => setFilter("NON-VEG")}
                        className={`flex-1 py-3.5 text-[15px] font-bold tracking-wide rounded-full transition-all duration-300 ${filter === "NON-VEG" ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20" : "text-slate-400 hover:text-white"}`}
                    >
                        Non-Veg
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500" />
                    {aiGenerating && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            <Loader2 className="w-4 h-4 animate-spin text-[#FF6B00]" />
                        </div>
                    )}
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        disabled={aiGenerating}
                        className="w-full bg-[#0b101a] border border-[#1a2235] text-white placeholder:text-slate-500 rounded-[24px] py-[18px] pl-12 pr-12 text-[15px] font-medium focus:outline-none focus:border-[#FF6B00]/50 transition-colors"
                        placeholder="Search healthy meals..."
                        type="text"
                    />
                </div>

                {/* Recommended Meals */}
                <div>
                    <div className="flex justify-between items-center mb-5 mt-2">
                        <h2 className="text-[19px] font-bold text-white tracking-tight">Recommended Meals</h2>
                        <button className="text-[#FF6B00] text-[15px] font-bold hover:underline">
                            See all
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-x-3 gap-y-6">
                            {foodItems.length > 0 ? foodItems.map((item) => (
                                <div key={item.id} className="flex flex-col group cursor-pointer">
                                    <div className="aspect-square rounded-[24px] overflow-hidden mb-3 bg-[#111623] border border-white/5 relative">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <h3 className="text-white text-[13px] font-bold leading-tight mb-1 truncate px-0.5">{item.title}</h3>
                                    <p className="text-[#FF6B00] text-[11px] font-bold px-0.5">{item.calories} kcal</p>
                                </div>
                            )) : (
                                <div className="col-span-3 text-center py-8 text-slate-500 text-sm">
                                    No meals found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Nav */}
            <NavigationBar />
        </div>
    );
}
