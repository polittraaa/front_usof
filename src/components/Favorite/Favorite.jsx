import { useEffect, useState } from "react";
import PostDemo from "../PostDemo/PostDemo";
import "./Favorite.css";

function Favorites({ onRouteChange, isSignedIn, userId }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("rating");
  const [order, setOrder] = useState("desc");
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
          `${import.meta.env.VITE_API_URL}/favorites?page=${page}&sort=${sort}&order=${order}`,
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
  }, [page, sort, order, isSignedIn]);

  function openPost(id) {
    onRouteChange(`post:${id}`);
  }

  return (
    <div className="content-main">
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
         Your Favorite Posts
      </h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && posts.length > 0 && (
        <div className="sorting">
          <button
            className={`filter mr4 ${sort === "date" ? "active" : ""}`}
            onClick={() => {
              setSort("date");
              setOrder("desc");
              setPage(1);
            }}
          >
            New
          </button>
          <button
            className={`filter ${sort === "rating" ? "active" : ""}`}
            onClick={() => {
              setSort("rating");
              setOrder("desc");
              setPage(1);
            }}
          >
            Rating
          </button>
          <hr />
        </div>
      )}

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

      {!loading && posts.length > 0 && (
        <div className="pagin">
          <button
            className="arrow"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ←
          </button>
          <span style={{ margin: "0 0.5rem" }}>
            page {page} of {totalPages}
          </span>
          <button
            className="arrow"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default Favorites;
