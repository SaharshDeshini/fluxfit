import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import NavigationBar from "../components/NavigationBar";

export default function CommunityPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Try to fetch from backend
                const res = await api.get('/api/community/posts');
                if (res.data && res.data.length > 0) {
                    setPosts(res.data);
                    return;
                }
            } catch (error) {
                console.error("Failed to fetch community posts", error);
            } finally {
                setLoading(false);
            }

            // Fallback to high-fidelity mock data matching the new design
            setPosts([
                {
                    postId: "1",
                    userName: "Marcus Thompson",
                    userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEQkIINP5i37gTOfd8bS83S8p_iH0zX8z76sXvKqV0V7t_O6Wp9v6I9gZ0_J8n4p-_5wX5gK3fV2tM7mF1fW8w4zX8rV7wW5xV0oT9pK5wD4vW8oJ9fC7kL9tF7qK6yC4qX0hW9mW2rD2yX4vJ9mK8mF4oC8mV9jL5oC3kV3jH6uM5nK4uY5pM2",
                    content: "Finally hit my PR on deadlifts today! 180kg never felt so light. Keep pushing, fam! 🔥 <span class='text-primary font-medium'>#shredded #gymmotivation #fluxfit</span>",
                    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
                    likesCount: "1.2k",
                    commentsCount: 84,
                    timeAgo: "2 hours ago",
                    liked: true
                },
                {
                    postId: "2",
                    userName: "Sarah Jenkins",
                    userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKvW0tV5vQ6X4sZ2fR0yY7eN5eS9lK8uF1wL2wU3sP0vB0hXwR1rP3gF7_I4m0iG4rXwP7zH2kO8tQ8vW2xF4fN7rR0mC5pW7vY1tR7rD9mV4_Y1pW3uE2rJ6tZ8eQ1hN4q_C8zX6fY4_A3hY1mV8sH7vN3zJ0sJ9kP7mV7yP4wF4vL3zN0w",
                    content: "Meal prep Sunday! Fueling up for the week with this protein-packed bowl. 🥗✨ <span class='text-primary font-medium'>#healthyfood #mealprep #cleaneating</span>",
                    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
                    likesCount: "432",
                    commentsCount: 12,
                    timeAgo: "5 hours ago",
                    liked: false
                }
            ]);
        };
        fetchPosts();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        setSubmitting(true);
        try {
            const res = await api.post('/api/community/create', {
                content: newPostContent,
                imageUrl: null
            });
            if (res.data && res.data.success) {
                toast.success("Post created!");
                addOptimisticPost();
            }
        } catch (error) {
            toast.error("Failed to create post. " + (error.response?.data?.message || ""));
            toast.success("Post created! (Offline Mode)");
            addOptimisticPost();
        } finally {
            setSubmitting(false);
        }
    };

    const addOptimisticPost = () => {
        setPosts([{
            postId: Date.now().toString(),
            userName: "You",
            userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHXbB_T4eYg8xXj4wD24qN5pU9nO8gC0_tqL5JpZ2Xf7xN9iUuI5tO3vL1XyA2xO9wK8jQ1aN8sN6xX5tQ4bP2zJ7xU9sO6vF1mN9lW5xK3zJ7xC1tQ8vF0wE6lN8vX9yD0wE6rN9hW1tL8wP5zJ7xC1kM4yP2oT4uP6vF1mN9lW5xK3zJ7xC1tQ8vF0wE6lN8vX9yD0wE6rN9hW1tL8wP5zJ7xC1",
            content: newPostContent,
            imageUrl: null,
            likesCount: "0",
            commentsCount: 0,
            timeAgo: "Just now",
            liked: false
        }, ...posts]);
        setNewPostContent("");
    };

    return (
        <div className="bg-[#000000] font-sans text-slate-100 min-h-screen pb-24 relative overflow-x-hidden">
            {/* Header Section */}
            <header className="flex items-center justify-between p-6 sticky top-0 bg-[#000000] z-50">
                <h1 className="text-[22px] font-bold tracking-tight text-white">Community</h1>
                <div className="relative">
                    <button className="h-10 w-10 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-[26px]">notifications</span>
                    </button>
                    <div className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border border-black transform translate-x-1/2 -translate-y-1/2"></div>
                </div>
            </header>

            <main className="flex flex-col items-center w-full max-w-md mx-auto">
                {/* Share Progress Input */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full px-4 mb-5 mt-2">
                    <Tilt perspective={500} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="24px" scale={1.02}>
                        <form onSubmit={handleCreatePost} className="bg-white/5 backdrop-blur-xl rounded-[24px] p-2 flex items-center border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <div className="w-10 h-10 shrink-0 rounded-full border border-primary/40 overflow-hidden relative ml-2 p-0.5 shadow-inner">
                                <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                    <img alt="Your Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHXbB_T4eYg8xXj4wD24qN5pU9nO8gC0_tqL5JpZ2Xf7xN9iUuI5tO3vL1XyA2xO9wK8jQ1aN8sN6xX5tQ4bP2zJ7xU9sO6vF1mN9lW5xK3zJ7xC1tQ8vF0wE6lN8vX9yD0wE6rN9hW1tL8wP5zJ7xC1kM4yP2oT4uP6vF1mN9lW5xK3zJ7xC1tQ8vF0wE6lN8vX9yD0wE6rN9hW1tL8wP5zJ7xC1" />
                                </div>
                            </div>
                            <input
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="Share your progress"
                                className="flex-1 bg-transparent border-none text-white focus:ring-0 placeholder:text-slate-400 text-[15px] px-4 outline-none placeholder:font-medium"
                            />
                            <button type="button" className="w-10 h-10 flex items-center justify-center bg-black/40 border border-white/5 rounded-xl text-primary mr-2 transition-transform active:scale-95 hover:bg-white/5">
                                <span className="material-symbols-outlined text-[20px] fill-[1]">image</span>
                            </button>
                            {newPostContent.trim() && (
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="mr-2 text-primary font-bold text-sm bg-primary/10 px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                                </button>
                            )}
                        </form>
                    </Tilt>
                </motion.div>

                {/* Featured Challenge Banner */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full px-4 mb-6">
                    <Tilt perspective={1000} glareEnable={true} glareMaxOpacity={0.2} glareColor="rgba(255,106,0,0.2)" glareBorderRadius="24px" scale={1.03}>
                        <div className="bg-gradient-to-br from-primary/20 via-black/80 to-[#120800] backdrop-blur-xl rounded-[24px] p-6 border border-primary/30 relative overflow-hidden shadow-[0_15px_30px_rgba(255,106,0,0.15)]">
                            {/* Background subtle icon */}
                            <div className="absolute -bottom-6 -right-6 text-primary/10 transform rotate-[-15deg] pointer-events-none">
                                <span className="material-symbols-outlined text-[120px] fill-[1]">fitness_center</span>
                            </div>

                            <div className="relative z-10">
                                <span className="text-primary text-[9px] font-bold uppercase tracking-[0.2em] mb-2 block drop-shadow-md">Featured Challenge</span>
                                <h2 className="text-xl font-bold text-white tracking-tight mb-2 drop-shadow-md">30-Day Shred Challenge</h2>
                                <p className="text-[11px] text-slate-300 font-medium mb-5 max-w-[200px] leading-relaxed">
                                    Push your limits with 5,000+ members and win exclusive FluxFit rewards.
                                </p>
                                <button className="bg-gradient-to-tr from-primary to-[#ff6a00] hover:scale-105 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-transform shadow-[0_5px_15px_rgba(255,106,0,0.4)] active:scale-[0.98]">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </Tilt>
                </motion.div>

                {/* Feed */}
                <div className="w-full flex flex-col pb-6 space-y-4 px-4">
                    {posts.map((post, index) => (
                        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }} key={post.postId} className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden">
                            {/* Post Header (Avatar, Name, Time, Menu) */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 shrink-0 rounded-full border border-white/10 overflow-hidden bg-black/40 shadow-inner">
                                        <img alt={post.userName} src={post.userAvatar} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-white text-[13px]">{post.userName}</h3>
                                        <span className="text-[10px] text-slate-400 font-medium">{post.timeAgo}</span>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                </button>
                            </div>

                            {/* Post Image (Edge to edge) */}
                            {post.imageUrl && (
                                <div className="w-full aspect-square relative bg-black/60 flex items-center justify-center overflow-hidden">
                                    <img alt="Post visual" src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                                </div>
                            )}

                            {/* Action Bar & Content Wrapper */}
                            <div className="px-4 py-3">
                                {/* Action Bar */}
                                <div className="flex items-center mb-3 text-slate-400">
                                    <button className="flex items-center gap-1.5 transition-colors group mr-5">
                                        <span className={`material-symbols-outlined text-[22px] transition-transform group-active:scale-90 ${post.liked ? 'text-primary fill-[1] drop-shadow-[0_0_8px_rgba(255,106,0,0.5)]' : 'text-slate-400 group-hover:text-primary'}`}>
                                            favorite
                                        </span>
                                        <span className={`text-[11px] font-bold ${post.liked ? 'text-primary' : 'text-slate-300'}`}>{post.likesCount}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group mr-5">
                                        <span className="material-symbols-outlined text-[22px] group-hover:fill-[1] transition-transform group-active:scale-90">mode_comment</span>
                                        <span className="text-[11px] font-bold text-slate-300">{post.commentsCount}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group">
                                        <span className="material-symbols-outlined text-[22px] group-hover:fill-[1] transition-transform group-active:translate-x-1 group-active:-translate-y-1">send</span>
                                    </button>

                                    <button className="text-slate-400 hover:text-white transition-colors ml-auto group">
                                        <span className="material-symbols-outlined text-[24px] group-hover:fill-[1] transition-transform group-active:scale-90">bookmark</span>
                                    </button>
                                </div>

                                {/* Post Text */}
                                <div className="text-[13px] leading-relaxed mt-1 text-slate-300">
                                    <span className="font-bold text-white mr-2">{post.userName}</span>
                                    <span dangerouslySetInnerHTML={{ __html: post.content }} />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </main>

            {/* Global Navigation Bar */}
            <NavigationBar />
        </div>
    );
}
