const admin = require("firebase-admin");
const db = admin.firestore();

exports.createPost = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { content, imageUrl } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "Content is required"
      });
    }

    const userSnap = await db.collection("users").doc(uid).get();
    const userData = userSnap.data();

    const postRef = await db.collection("communityPosts").add({
      userId: uid,
      userName: userData.name || "Anonymous",
      content,
      imageUrl: imageUrl || "",
      timestamp: new Date(),
      likesCount: 0,
      commentsCount: 0
    });

    return res.json({
      success: true,
      postId: postRef.id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const snapshot = await db
      .collection("communityPosts")
      .orderBy("timestamp", "desc")
      .limit(20)
      .get();

    const posts = [];

    snapshot.forEach(doc => {
      posts.push({
        postId: doc.id,
        ...doc.data()
      });
    });

    return res.json(posts);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};