import { useEffect, useState } from 'react';
import PostDemo from '../PostDemo/PostDemo';

export default function CategoryPage({ catId, onRouteChange }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!catId) return;

    const fetchCategoryPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const limit = 5;
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/categories/${catId}/posts`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = await res.json();

        const rawPosts = Array.isArray(data.posts?.posts)
          ? data.posts.posts
          : [];

        if (rawPosts.length != 0){
        // Fetch categories and comments for each post
        const postsWithExtras = await Promise.all(
          rawPosts.map(async (post) => {
            const [catRes, comRes] = await Promise.all([
              fetch(`${import.meta.env.VITE_API_URL}/posts/${post.post_id}/categories`),
              fetch(`${import.meta.env.VITE_API_URL}/posts/${post.post_id}/comments`)
            ]);

            const catData = await catRes.json();
            const comData = await comRes.json();

            const commentCount = Array.isArray(comData)
              ? comData.length
              : comData.comments?.length || 0;

            return {
              ...post,
              categories: catData,
              comments: comData,
              commentCount,
            };
          })
        );
      
        setPosts(postsWithExtras);
        setTotalPages(data.page_count || 1);
      }
      else (
        <p>No posts found.</p>
      )
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [catId, page]);

  const openPost = (postId) => {
    onRouteChange(`post:${postId}`);
  };

  return (
    <div className="category-page">
      <h2>Posts in Category #{catId}</h2>

      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className="post-list mb5">
        {!loading && posts.length === 0 && <p>No posts found.</p>}
        {posts.map((post) => (
          <PostDemo
            key={post.post_id}
            post={post}
            onOpen={() => openPost(post.post_id)}
          />
        ))}
      </div>

      {!loading && !error && totalPages > 1 && (
        <div className="pagin">
          <button
            className="arrow"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ←
          </button>
          <span style={{ margin: '0 0.5rem' }}>
            Page {page} of {totalPages}
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
