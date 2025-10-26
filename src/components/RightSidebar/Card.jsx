import { useEffect, useState } from "react";
import './Card.css'

function Card({ post, onOpen }) {
  const [author, setAuthor] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  function excerpt(n = 30) {
    const short = post.title || '';
    if (short.length <= n) return short;
    let cut = short.slice(0, n);
    const lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > 0) cut = cut.slice(0, lastSpace);
    return cut.trim() + '...';
  }

  useEffect(() => {
    console.log(post)
    if (!post?.author_id) return;

    let cancelled = false;

    async function loadAuthor() {
      try {
        const res = await fetch(`${API_URL}/users/${post.author_id}`);
        if (!res.ok) throw new Error('Error loading author');
        const data = await res.json();
        if (!cancelled) setAuthor(data);
      } catch (err) {
        console.error('Error loading author:', err);
      }
    }

    loadAuthor();
    return () => {
      cancelled = true;
    };
  }, [post.author_id, API_URL]);

  if (!post) return <p>No hot topics available.</p>;

  const createdAt = new Date(post.publish_date).toLocaleDateString();
  const rating = post.rating?.value || 0;
  const commentsCount = post.commentCount || 0;

  return (
    <div className="card">
        <div className="demo-meta">
          <span className="demo-author">{author?.login || "Unknown"}</span>
          <span className="demo-time">{createdAt}</span>
        </div>
      <div className="card-body ml2">
        <a
          href={`/posts/${post.post_id}`}
          onClick={(e) => {
            e.preventDefault();
            onOpen(post.post_id);
          }}
        >
          <h3 className="demo-title">{excerpt()}</h3>
        </a>


        <div className="demo-stats">
        <div className="bage">
          {(post.categories?.length
            ? post.categories
            : [{ title: "no-category", category_id: "none" }]
          ).map((cat) => (
            <span key={cat.category_id} className="category-badge">
              {cat.title}
            </span>
          ))}
        </div>
          <div className="stat-item" title="Rating">
            <i className="fa-solid fa-star" style={{ color: "#f5c518" }}></i>
            {rating}
          </div>

          <div className="stat-item" title="Comments">
            <i className="fa-solid fa-comment" style={{ color: "#6870d8ff" }}></i>
            {commentsCount}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
