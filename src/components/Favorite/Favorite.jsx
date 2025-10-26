import { useEffect, useState } from "react";
import PostDemo from "../PostDemo/PostDemo";
import "./Favorite.css";

function Favorites({ onRouteChange, isSignedIn, userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/favorites`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch favorites");

        const data = await res.json();

        if (!cancelled) {
          setPosts(data.favorites || data.posts || []);
          setTotalPages(data.totalPages || 1);
        }
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
  }, [isSignedIn]);

  function openPost(id) {
    onRouteChange(`post:${id}`);
  }

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
          You haven’t added any favorites yet
        </p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <PostDemo
              key={post.post_id}
              post={post}
              isSignedIn={isSignedIn}
              onOpen={openPost}
              onRouteChange={onRouteChange}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
