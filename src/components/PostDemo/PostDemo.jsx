import { useEffect, useState } from 'react';
import './PostDemo.css';

function PostDemo({ post, isSignedIn, onOpen }) {
  const [author, setAuthor] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes_count || 0);

  // Shorten text content
  function excerpt(n = 200) {
    const short = post.content || '';
    if (short.length <= n) return short;
    let cut = short.slice(0, n);
    const lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > 0) cut = cut.slice(0, lastSpace);
    return cut.trim() + '...';
  }

  // Load author
  useEffect(() => {
    if (!post.author_id) return;
    let cancelled = false;
    async function loadAuthor() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${post.author_id}`);
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
  }, [post.author_id]);

  // function likecheck{}

  // Like/Unlike handler
  async function handleLike() {
    try {
      if (!isSignedIn) throw new Error('Sign in to like');
       const url = `${import.meta.env.VITE_API_URL}/posts/${post.post_id}/like`;
      if (!isLiked) {
       const res = await fetch(url, { method: 'POST', credentials: 'include' });
       console.log(res);
       
        if (!res.ok) throw new Error('Could not like');
        setLikes((prev) => prev + 1);
        setIsLiked(true);
      } else {
        const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
        if (!res.ok) throw new Error('Could not unlike');
        setLikes((prev) => Math.max(prev - 1, 0));
        setIsLiked(false);
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  }

  // Values for UI
  const createdAt = new Date(post.publish_date).toLocaleDateString();
  const avatar = author?.picture
    ? `http://localhost:3001/${author.picture}`
    : 'http://localhost:3001/public/uploads/base_default.png';
  const dislikes = post.dislikes_count || 0;
  const rating = post.rating || 0;
  const commentsCount = post.commentCount || 0;

  return (
    <div className="demo">
      <div className="demo-header">
        {/* <img src={avatar} className="demo-avatar" /> */}
        <a  href={`/users/${author?.login}`}
          onClick={(e) => {
            e.preventDefault();
            onRouteChange(`user:${author?.user_id}`);
          }}
        >   
          <img src={avatar}  className="demo-avatar" />
        </a>
        <div className="demo-meta">
          <span className="demo-author">{author?.login}</span>
          <span className="middle-dot">&#8226;</span>
          <span className="demo-time">{createdAt}</span>
        </div>
      </div>

      <a
        href={`/posts/${post.post_id}`}
        onClick={(e) => {
          e.preventDefault();
          onOpen(post.post_id);
        }}
      >
        <h3 className="demo-title">{post.title}</h3>
        <p className="demo-excerpt">{excerpt()}</p>
      </a>

      <div className="bage">
        {(post.categories && post.categories.length > 0
          ? post.categories
          : [{ title: 'no-category', category_id: 'none' }]
        ).map((cat) => (
          <span key={cat.category_id} className="category-badge">
            {cat.title}
          </span>
        ))}
      </div>

      <div className="demo-stats">
        <div className="stat-item" title="Likes">
          <i
            onClick={handleLike}
            className={`fa-solid fa-heart ${isLiked ? 'liked' : ''}`}
            style={{
              color: isLiked ? '#cf741a' : '#e42b3e',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
          ></i>
          {likes}
        </div>

        <div className="stat-item" title="Dislikes">
          <i className="fa-solid fa-heart-crack" style={{ color: '#470d13ff' }}></i>
          {dislikes}
        </div>

        <div className="stat-item" title="Rating">
          <i className="fa-solid fa-star" style={{ color: '#f5c518' }}></i>
          {rating}
        </div>

        <div className="stat-item" title="Comments">
          <i className="fa-solid fa-comment" style={{ color: '#6870d8ff' }}></i>
          {commentsCount}
        </div>

        <div className="stat-item" title="Save">
          <i className="fa-solid fa-bookmark" style={{ color: '#79d868ff' }}></i>
        </div>
      </div>
    </div>
  );
}

export default PostDemo;
