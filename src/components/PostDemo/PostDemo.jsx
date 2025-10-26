import { useEffect, useState } from 'react';
import './PostDemo.css';

function PostDemo({ post, isSignedIn, onOpen, onRouteChange, userId }) {
  const [author, setAuthor] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Shorten content
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${post.author_id}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Error loading author');
        const data = await res.json();
        if (!cancelled) setAuthor(data);
      } catch (err) {
        console.error('Error loading author:', err);
      }
    }

    loadAuthor();
    return () => { cancelled = true; };
  }, [post.author_id]);

  const likes_count = post?.likes_count;
  const dislikes_count = post?.dislikes_count;
  const rating = post?.rating;

  const createdAt = post.publish_date
    ? new Date(post.publish_date).toLocaleDateString()
    : '';
  const avatar = author?.picture
    ? `http://localhost:3001/${author.picture}`
    : 'http://localhost:3001/public/uploads/base_default.png';
  const commentsCount = post.commentCount || 0;

  async function handleDelete() {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.post_id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        alert('Post successfully deleted');
        // onRouteChange('home');
      } else {
        alert('Error when deleting post');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.post-menu') && !e.target.closest('.fa-ellipsis-vertical')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="demo">
      <div className="demo-header">
        <a
          href={`/users/${author?.login}`}
          onClick={(e) => {
            e.preventDefault();
            onRouteChange(`user:${author?.user_id}`);
          }}
        >
          <img src={avatar} className="demo-avatar" />
        </a>
        <div className="demo-meta">
          <span className="demo-author">{author?.login}</span>
          <span className="middle-dot">&#8226;</span>
          <span className="demo-time">{createdAt}</span>
        </div>

        <div>
          {userId === post.author_id && (
            <div style={{ position: 'relative' }}>
              <i
                className="fa-solid fa-ellipsis-vertical"
                style={{
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '.3rem',
                }}
                onClick={() => setShowMenu(!showMenu)}
              ></i>

              {showMenu && (
                <div
                  className="post-menu"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '1.5rem',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    minWidth: '150px'
                  }}
                >
                  <div
                    className="menu-item"
                    onClick={handleDelete}
                    style={{
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      color: '#c00'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fbeaea'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <i className="fa-solid fa-trash" style={{ marginRight: '6px' }}></i> Delete
                  </div>
                </div>
              )}
            </div>
          )}
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
            // onClick={() => handleLike('like')}
            className='fa-solid fa-heart'
            style={{
              // color: userLikeType === 'like' ? '#cf741a' : '#d5505eff',
              color: '#d5505eff',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
          ></i>
          {likes_count}
        </div>

        <div className="stat-item" title="Dislikes">
          <i
            // onClick={() => handleLike('dislike')}
            className='fa-solid fa-heart-crack'
            style={{ 
              // color: userLikeType === 'dislike' ? '#cf741a' : '#470d13ff',
              color: '#470d13ff',
              cursor: 'pointer',
              transition: 'transform 0.2s', }}
          ></i>
          {dislikes_count}
        </div>

        <div className="stat-item" title="Rating">
          <i className="fa-solid fa-star" style={{ color: '#f5c118ff' }}></i>
          {rating}
        </div>

        <div className="stat-item" title="Comments">
          <i className="fa-solid fa-comment" style={{ color: '#b09961ff' }}></i>
          {commentsCount}
        </div>

        <div className="stat-item" 
        title="Save">
          <i className="fa-solid fa-bookmark" style={{ color: '#908659ff' }}></i>
        </div>
      </div>
    </div>
  );
}

export default PostDemo;
