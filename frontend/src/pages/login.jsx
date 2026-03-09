import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";
import { Loader2, Mail, Lock, EyeOff, Eye, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, signup, loginWithGoogle } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success("Logged in successfully!");
                navigate("/dashboard");
            } else {
                await signup(formData.email, formData.password, formData.name);
                toast.success("Account created successfully!");
                navigate("/onboarding");
            }
        } catch (error) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        try {
            const result = await loginWithGoogle();
            toast.success("Logged in with Google!");
            if (result && result.isNewUser) {
                navigate("/onboarding");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            toast.error(error.message || "Google Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#000000] text-slate-100 min-h-screen flex flex-col p-6 items-center justify-center font-sans">
            <div className="w-full max-w-sm flex flex-col">
                {/* Header Section */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-black text-2xl">bolt</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{isLogin ? "Welcome back" : "Create account"}</h1>
                    <p className="text-slate-400 text-sm">{isLogin ? "Log in to your account" : "Start your fitness journey"}</p>
                </div>

                {/* Main Form */}
                <form className="space-y-4" onSubmit={handleAuth}>
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Name</label>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">Email</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold text-base rounded-xl py-3 mt-4 flex justify-center items-center gap-2 hover:bg-[#ff8c42] transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                {isLogin ? "Sign In" : "Sign Up"}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-4">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-slate-500 uppercase font-medium">Or continue with</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full mt-6 bg-[#121212] border border-white/10 hover:bg-white/5 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>

                <div className="mt-8 text-center text-sm text-slate-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary hover:underline font-semibold"
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
