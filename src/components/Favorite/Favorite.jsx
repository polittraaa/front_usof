import { useEffect, useState } from "react";
import PostDemo from "../PostDemo/PostDemo";
import "./Favorite.css";
import "../PostDemo/PostDemo.css";

function Favorites({ onRouteChange, isSignedIn, userId }) {
  const [posts, setPosts] = useState([]);
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Load favorites (list of post IDs)
  useEffect(() => {
    if (!isSignedIn) {
      onRouteChange("login");
      return;
    }

    let cancelled = false;

    async function loadFavorites() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/favorites`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch favorites");

        const data = await res.json();

        const favList = Array.isArray(data)
          ? data
          : Array.isArray(data.fav_post)
          ? data.fav_post
          : [];

        if (!cancelled) setFavs(favList);
      } catch (err) {
        console.error("Error loading favorites:", err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, API_URL, onRouteChange]);

  // Load post data for each favorite
  useEffect(() => {
    if (!favs.length) {
      setPosts([]);
      return;
    }

    let cancelled = false;

    async function loadPostsFromFavorites() {
      try {
        setLoading(true);
        const postsWithData = await Promise.all(
          favs.map(async (fav) => {
            try {
              const postRes = await fetch(`${API_URL}/posts/${fav.post_id}`, {
                credentials: "include",
              });
              if (!postRes.ok) return null;
              const postDataTrim = await postRes.json();
              const postData = postDataTrim.post;
              console.log(postData)

              // Fetch categories
              const catRes = await fetch(
                `${API_URL}/posts/${fav.post_id}/categories`,
                { credentials: "include" }
              );
              const categories = await catRes.json();

              // Fetch comments
              const comRes = await fetch(
                `${API_URL}/posts/${fav.post_id}/comments`,
                { credentials: "include" }
              );
              const comments = await comRes.json();

              const commentCount = Array.isArray(comments)
                ? comments.length
                : comments.comments?.length || 0;

              // Normalize to PostDemo expected shape
              return {
                post_id: postData.post_id,
                author_id: postData.author_id,
                title: postData.title,
                content: postData.content,
                publish_date: postData.publish_date,
                likes_count: postData.likes_count ?? 0,
                dislikes_count: postData.dislikes_count ?? 0,
                rating: postData.rating ?? 0,
                categories: categories || [],
                comments: comments || [],
                commentCount,
                addedAt: fav.add_date, // Optional: show when it was favorited
              };
            } catch (err) {
              console.warn("Skipping invalid post:", fav.post_id, err);
              return null;
            }
          })
        );

        const validPosts = postsWithData.filter((p) => p !== null);

        if (!cancelled) setPosts(validPosts);
      } catch (err) {
        console.error("Error loading posts for favorites:", err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPostsFromFavorites();

    return () => {
      cancelled = true;
    };
  }, [favs, API_URL]);

  function openPost(id) {
    onRouteChange(`post:${id}`);
  }
console.log(posts);

  return (
    <div className="content-main">
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Your Favorite Posts
      </h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading favorites...</p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          You haven’t added any favorites yet.
        </p>
      ) : (
        <div className="post-list w-100%">
          {posts.map((post) => (
            <div key={post.post_id} style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.9rem", color: "#777", marginLeft: "0.5rem" }}>
                Favorited on: {new Date(post.addedAt).toLocaleDateString()}
              </p>
              <PostDemo
                post={post}
                isSignedIn={isSignedIn}
                onOpen={openPost}
                onRouteChange={onRouteChange}
                userId={userId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
