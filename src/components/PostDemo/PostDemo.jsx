import { useEffect, useState } from 'react';
import './PostDemo.css';

function PostDemo({ post, onOpen }) {
    const [author, setAuthor] = useState(null);

    function stripHtml(html) {
        if (!html) return '';
        return html.replace(/<\/?[^>]+(>|$)/g, '');
    }

    function excerpt(text, n = 200) {
        const s = stripHtml(text).trim();
        if (s.length <= n) return s;

        let cut = s.slice(0, n);
        const lastSpace = cut.lastIndexOf(' ');
        if (lastSpace > 0) cut = cut.slice(0, lastSpace);

        return cut.trim() + '...';
    }

    useEffect(() => {
        console.log('what is post.author_id in demo', post.author_id)
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
        return () => { cancelled = true };
    },[post.author_id]);

    //date
    function formatTime(timestamp) {
        const diff = Date.now() - new Date(timestamp).getTime();
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString();
    }

    const createdAt = formatTime(post.publish_date);
    console.log('timestamp', createdAt);
    const avatar = `http://localhost:3001/${author?.picture}`;
    console.log('what is the avatar: ', avatar)
    const username = `@${author?.login}`;

    const likes = post.likes_count || 0;
    const dislikes = post.dislikes_count || 0; 
    const rating = post.rating || 0;
    const commentsCount = post.commentsCount || 0;

    return (
        <div className="demo custom-hover tl ">
            <div className="post-header">
                <img src={avatar} alt={username} className="post-avatar" />
                <div className="post-meta">
                    <span className="post-author">{username}</span>
                    <span className="middle-dot">&#8226;</span>
                    <span className="post-time">{createdAt}</span>
                </div>
            </div>

            <a
                href={`/posts/${post.post_id}`}// id or post_id
                onClick={(e) => { e.preventDefault(); onOpen(post.post_id); }}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{excerpt(post.content)}</p>
            </a>

            <div className="" style={{ marginTop: '.5rem', marginBottom: '.5rem', display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                {(post.categories && post.categories.length > 0 ? post.categories : [{ title: 'no-category', id: 'none' }]).map(cat => (
                    <span key={cat.id} className="category-badge">{cat.title}</span>
                ))}
            </div>

            <div className="post-stats">
                <div className="stat-item" title="Likes">
                    <i className="fa-solid fa-thumbs-up" style={{ color: '#216805ff' }}></i>
                    {likes}
                </div>

                <div className="stat-item" title="Dislikes">
                    <i className="fa-solid fa-thumbs-down" style={{ color: '#dc3545' }}></i>
                    {dislikes}
                </div>

                <div className="stat-item" title="Rating">
                    <i className="fa-solid fa-star" style={{ color: '#f5c518' }}></i>
                    {rating}
                </div>

                <div className="stat-item" title="Comments">
                    <i className="fa-solid fa-comment" style={{ color: '#1f2efaff' }}></i>
                    {commentsCount}
                </div>
            </div>
        </div>
    );
}

export default PostDemo;
