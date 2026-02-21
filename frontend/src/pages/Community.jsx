import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Community.css";
import {
  FaBell,
  FaHeart,
  FaComment,
  FaPaperPlane,
  FaBookmark,
  FaHome,
  FaDumbbell,
  FaUtensils,
  FaUser
} from "react-icons/fa";

const Community = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH POSTS
  // =========================
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("fluxfit_token");

        const res = await fetch(
          "https://fluxfit.onrender.com/api/community/posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error("Failed to fetch posts");

        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // =========================
  // CREATE POST
  // =========================
  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const token = localStorage.getItem("fluxfit_token");

      const res = await fetch(
        "https://fluxfit.onrender.com/api/community/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newPost,
            imageUrl: "",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error("Post failed");

      // Refresh posts after creating
      setNewPost("");
      window.location.reload();

    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="community-wrapper">
        <div className="phone">
          <h2 style={{ padding: "20px" }}>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="community-wrapper">
      <div className="phone">

        {/* HEADER */}
        <div className="community-header">
          <h2>Community</h2>
          <button className="icon-btn">
            <FaBell />
          </button>
        </div>

        {/* SHARE BOX */}
        <div className="share-box">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="user"
          />
          <input
            placeholder="Share your progress..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button
            className="image-btn"
            onClick={handleCreatePost}
          >
            <FaPaperPlane />
          </button>
        </div>

        {/* POSTS */}
        {posts.map((post) => (
          <div className="post" key={post.postId}>
            <div className="post-header">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="user"
              />
              <div>
                <h4>{post.userName}</h4>
                <span>
                  {new Date(post.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt="post"
                className="post-image"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e"
                alt="default"
                className="post-image"
              />
            )}

            <div className="post-actions">
              <div>
                <button className="action-btn">
                  <FaHeart />
                </button>
                <span>{post.likesCount}</span>

                <button className="action-btn">
                  <FaComment />
                </button>
                <span>{post.commentsCount}</span>
              </div>

              <button className="action-btn">
                <FaBookmark />
              </button>
            </div>

            <p className="caption">
              <strong>{post.userName}</strong> {post.content}
            </p>
          </div>
        ))}

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          <button onClick={() => navigate("/dashboard")}>
            <FaHome />
            <span>Home</span>
          </button>

          <button onClick={() => navigate("/workout")}>
            <FaDumbbell />
            <span>Training</span>
          </button>

          <button onClick={() => navigate("/diet")}>
            <FaUtensils />
            <span>Nutrition</span>
          </button>

          <button onClick={() => navigate("/profile")}>
            <FaUser />
            <span>Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Community;