import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { generateProgramPromptString } from "../hooks/useGenerateProgramPrompt";
import { generateWorkoutProgram } from "../lib/gemini";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { updateProfile } = useAuthStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1
        gender: "Male",
        age: 25,
        heightUnit: "CM",
        height: 180,
        weightUnit: "KG",
        weight: 75,

        // Step 2
        goal: "Weight Loss",
        level: "Beginner",

        // Step 3
        daysPerWeek: 3,
        duration: 45,
        targetMuscleGroup: "Full Body",
        gymAccess: true
    });

    const updateData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            setLoading(true);
            try {
                // Submit onboarding data to Firebase user profile Instead of broken API mocked route
                await updateProfile(formData);
                toast.success("Profile Setup Complete!");

                // Generate AI workout plan immediately based on user form answers
                toast.info("Analyzing your profile... building custom 2-week plan...");
                try {
                    const promptText = generateProgramPromptString(formData);
                    const generatedPlan = await generateWorkoutProgram(promptText);

                    // Attach generated plan back to the user's document
                    await updateProfile({ active_program: generatedPlan });
                    toast.success("Fitness Plan successfully generated!");
                } catch (genError) {
                    console.error("Failed AI Generation during onboarding:", genError);
                    toast.error("Failed to generate AI plan, you can try again later.");
                }

                // Proceed to dashboard regardless of AI generation success
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);

            } catch (error) {
                toast.error(error.message || "Failed to submit profile");
                console.error("Profile submission error:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-slate-100 flex flex-col font-sans p-6 pb-24 overflow-x-hidden relative">
            {/* Ambient Base Layer */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[50%] bg-primary/10 blur-[120px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[50%] bg-[#ff6a00]/10 blur-[120px] rounded-full mix-blend-screen"></div>
            </div>

            <main className="relative z-10 max-w-lg mx-auto w-full flex-1 flex flex-col pt-4 space-y-8">
                {/* Header Context */}
                <header className="flex items-center justify-between">
                    <button onClick={handleBack} className={`text-slate-400 hover:text-white transition-colors flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium">Back</span>
                    </button>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{Math.round((step / 3) * 100)}% Complete</div>
                </header>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative shadow-inner">
                    <motion.div
                        initial={{ width: `${((step - 1) / 3) * 100}%` }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary to-[#ff4e00] shadow-[0_0_10px_rgba(255,106,0,0.5)]"
                    />
                </div>

                <div className="flex-1 relative">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                                <div>
                                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 drop-shadow-md">Welcome.</h1>
                                    <p className="text-slate-400 font-medium text-lg leading-relaxed">Let's custom-build your metabolic and physical profile.</p>
                                </div>
                                <div className="space-y-6">
                                    {/* Gender */}
                                    <div className="space-y-3">
                                        <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest pl-1">Biological Identity</label>
                                        <div className="flex gap-4">
                                            {['Male', 'Female'].map((g) => (
                                                <button
                                                    key={g}
                                                    onClick={() => updateData('gender', g)}
                                                    className={`flex-1 py-4 rounded-2xl border-2 font-bold text-[15px] transition-all duration-300 shadow-md ${formData.gender === g ? 'bg-primary/10 border-primary text-white shadow-[0_0_20px_rgba(255,106,0,0.15)] ring-1 ring-primary/50' : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/5'}`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Age */}
                                    <div className="space-y-3">
                                        <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest pl-1">Chronological Age</label>
                                        <div className="bg-black/40 border border-white/10 p-2 rounded-2xl shadow-inner relative overflow-hidden">
                                            <input 
                                                type="number" 
                                                value={formData.age}
                                                onChange={(e) => updateData('age', e.target.value === '' ? '' : Number(e.target.value))}
                                                onBlur={(e) => {
                                                    let val = Number(e.target.value);
                                                    if (!val || val < 16) val = 16;
                                                    else if (val > 100) val = 100;
                                                    updateData('age', val);
                                                }}
                                                className="w-full text-center bg-transparent border-none text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(255,106,0,0.3)] focus:ring-0 py-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                min="16"
                                                max="100"
                                                placeholder="25"
                                            />
                                        </div>
                                    </div>
                                    {/* Height */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center pl-1">
                                            <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Height</label>
                                            <div className="flex bg-black/50 border border-white/10 rounded-lg overflow-hidden shadow-inner">
                                                {['CM', 'FT'].map((u) => (
                                                    <button key={u} onClick={() => updateData('heightUnit', u)} className={`px-4 py-1.5 text-[10px] font-bold transition-colors ${formData.heightUnit === u ? 'bg-primary text-black' : 'text-slate-400 hover:text-white'}`}>{u}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input type="range" min={formData.heightUnit === 'CM' ? 140 : 4.5} max={formData.heightUnit === 'CM' ? 220 : 7.2} step={formData.heightUnit === 'CM' ? 1 : 0.1} value={formData.height} onChange={(e) => updateData('height', parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
                                            <div className="text-center mt-3 text-3xl font-black text-white font-mono">{formData.height} <span className="text-sm text-primary -ml-1 font-bold">{formData.heightUnit.toLowerCase()}</span></div>
                                        </div>
                                    </div>
                                    {/* Weight */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center pl-1">
                                            <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Weight</label>
                                            <div className="flex bg-black/50 border border-white/10 rounded-lg overflow-hidden shadow-inner">
                                                {['KG', 'LBS'].map((u) => (
                                                    <button key={u} onClick={() => updateData('weightUnit', u)} className={`px-4 py-1.5 text-[10px] font-bold transition-colors ${formData.weightUnit === u ? 'bg-primary text-black' : 'text-slate-400 hover:text-white'}`}>{u}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input type="range" min={formData.weightUnit === 'KG' ? 40 : 90} max={formData.weightUnit === 'KG' ? 150 : 330} step={1} value={formData.weight} onChange={(e) => updateData('weight', parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
                                            <div className="text-center mt-3 text-3xl font-black text-white font-mono">{formData.weight} <span className="text-sm text-primary -ml-1 font-bold">{formData.weightUnit.toLowerCase()}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-8">
                                <div>
                                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 drop-shadow-md">What's your goal?</h1>
                                    <p className="text-slate-400 font-medium text-lg leading-relaxed">Choose the path that fits your journey.</p>
                                </div>
                                <div className="space-y-4 pt-2">
                                    {[
                                        { id: 'Weight Loss', desc: 'Burn fat, lean down', bg: 'from-orange-500/80 to-red-600/80', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop' },
                                        { id: 'Muscle Build', desc: 'Increase mass and strength', bg: 'from-blue-600/80 to-purple-700/80', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop' },
                                        { id: 'Stay Fit', desc: 'Maintain overall health', bg: 'from-emerald-500/80 to-teal-700/80', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop' }
                                    ].map((goal, index) => {
                                        const isSelected = formData.goal === goal.id;
                                        return (
                                            <Tilt key={goal.id} perspective={1000} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="16px" scale={1.02} tiltMaxAngleX={5} tiltMaxAngleY={5}>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}
                                                    onClick={() => updateData('goal', goal.id)}
                                                    className={`w-full min-h-[140px] relative group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${isSelected ? 'border-primary ring-4 ring-primary/20' : 'border-white/10 hover:border-white/30'}`}
                                                >
                                                    <div className={`absolute inset-0 z-10 bg-gradient-to-r ${goal.bg}`}></div>
                                                    <img src={goal.img} alt={goal.id} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-700" />
                                                    <div className="absolute inset-0 p-6 flex flex-col justify-center bg-black/40 group-hover:bg-black/20 transition-all z-20 backdrop-blur-[2px]">
                                                        <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{goal.id}</h3>
                                                        <p className="text-white/80 text-sm font-medium">{goal.desc}</p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="absolute top-4 right-4 z-30">
                                                            <div className="bg-primary text-black rounded-full p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(255,106,0,0.5)]">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </Tilt>
                                        )
                                    })}
                                </div>
                                <div className="space-y-4 pt-6">
                                    <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md mb-4">Select your level</h3>
                                    {[
                                        { id: 'Beginner', desc: 'New to fitness training' },
                                        { id: 'Intermediate', desc: 'Regular workout habit' },
                                        { id: 'Pro', desc: 'Advanced athlete' }
                                    ].map((lvl) => (
                                        <button
                                            key={lvl.id}
                                            onClick={() => updateData('level', lvl.id)}
                                            className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 shadow-md ${formData.level === lvl.id ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(255,106,0,0.1)]' : 'bg-[#16181c] border-white/5 hover:border-white/20'}`}
                                        >
                                            <div className="text-left">
                                                <h4 className="font-bold text-white text-base">{lvl.id}</h4>
                                                <p className="text-xs text-slate-400 mt-1">{lvl.desc}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.level === lvl.id ? 'border-primary' : 'border-slate-600'}`}>
                                                {formData.level === lvl.id && <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_rgba(255,106,0,0.8)]"></div>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-10">
                                <div>
                                    <h1 className="text-4xl font-black text-white tracking-tight mb-2 drop-shadow-md">Final Calibration</h1>
                                    <p className="text-slate-400 font-medium text-lg leading-relaxed">Let's set your schedule limits.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[13px] font-bold text-white tracking-tight">How many days per week?</label>
                                    <div className="flex justify-between gap-3">
                                        {[1, 2, 3, 4, 5].map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => updateData('daysPerWeek', d)}
                                                className={`flex-1 aspect-square rounded-2xl flex items-center justify-center text-xl font-bold transition-all shadow-md border ${formData.daysPerWeek === d ? 'bg-[#1a0a00] border-primary text-primary shadow-[0_0_15px_rgba(255,106,0,0.2)] ring-1 ring-primary/30' : 'bg-[#16181c] border-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[13px] font-bold text-white tracking-tight">Max workout duration</label>
                                        <span className="text-2xl font-black text-primary drop-shadow-[0_0_10px_rgba(255,106,0,0.4)]">{formData.duration} <span className="text-sm text-slate-400 font-medium tracking-normal">min</span></span>
                                    </div>
                                    <div className="relative pt-2 pb-6">
                                        <input type="range" min={15} max={90} step={15} value={formData.duration} onChange={(e) => updateData('duration', parseInt(e.target.value))} className="w-full h-2.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary" />
                                        <div className="absolute top-10 w-full flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            <span>15 MIN</span>
                                            <span>45 MIN</span>
                                            <span>90 MIN</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <label className="text-[13px] font-bold text-white tracking-tight">Target Muscle Groups</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Full Body', 'Upper Body', 'Lower Body', 'Core & Abs'].map((tg) => (
                                            <button
                                                key={tg}
                                                onClick={() => updateData('targetMuscleGroup', tg)}
                                                className={`py-4 px-2 rounded-xl text-center text-sm font-bold transition-all border shadow-sm ${formData.targetMuscleGroup === tg ? 'bg-[#1a0a00] border-primary text-white shadow-[0_0_15px_rgba(255,106,0,0.15)] ring-1 ring-primary/30' : 'bg-[#111317] border-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                                            >
                                                {tg}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 pb-12">
                                    <button
                                        onClick={() => updateData('gymAccess', !formData.gymAccess)}
                                        className={`w-full p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 shadow-md ${formData.gymAccess ? 'bg-[#1a0a00] border-primary/50 text-white shadow-[0_0_15px_rgba(255,106,0,0.1)]' : 'bg-[#16181c] border-white/5 text-slate-400'}`}
                                    >
                                        <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors border-2 shrink-0 ${formData.gymAccess ? 'bg-primary border-primary text-black' : 'bg-transparent border-slate-600'}`}>
                                            {formData.gymAccess && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <div className="text-left font-medium">
                                            I have access to a full gym 
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CTA Button at bottom of scroll */}
                <div className="pt-6 w-full flex justify-center">
                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className={`w-full max-w-[320px] py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all relative overflow-hidden group ${
                            loading ? "bg-primary/50 text-white/50 cursor-not-allowed" : "bg-primary text-black hover:bg-primary-hover shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:shadow-[0_0_30px_rgba(255,106,0,0.5)] active:scale-[0.98]"
                        }`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                {step === 3 ? "Generate Plan" : "Continue"}
                                {step < 3 && <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>}
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}
