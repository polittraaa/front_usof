import{ useEffect, useState } from 'react';
import './Post.css'

function Post({ postId, onRouteChange, isSignedIn, userId }) {

    const [author, setAuthor] = useState(null);
    const [post, setPost] = useState(null);

     useEffect(() => {
        if (!postId) return;
        let cancelled = false;
        async function loadPost() {
            try {                
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`);
                if (!res.ok) throw new Error('Error loading post');
                const data = await res.json();
                if (!cancelled) setPost(data);
            } catch (err) {
                console.error('Error loading post:', err);
            }
        }
        loadPost();
        return () => { cancelled = true };
    },[postId]);

    useEffect(() => {
        if (!post?.author_id) return;
        let cancelled = false;
        async function loadAuthor() {
            try {                
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${post.author_id}`);
                if (!res.ok) throw new Error('Error loading author');
                const data = await res.json();
                if (!cancelled) setAuthor(data);
                setAuthor(data);
                console.log(data)
            } catch (err) {
                console.error('Error loading author:', err);
            }
        }

        loadAuthor();
        return () => { cancelled = true };
    },[post?.author_id]);

    console.log(author)
    console.log(post)
    const createdAt = new Date(post?.publish_date).toLocaleDateString();

    const avatar = author?.picture ? `http://localhost:3001/${author?.picture}` : 'http://localhost:3001/public/uploads/base_default.png'
    const likes = post?.likes_count || 0;
    const dislikes = post?.dislikes_count || 0; 
    const rating = post?.rating || 0;
    const commentsCount = post?.commentCount || 0;

    return (
        <div className="post">
            <div className="post-header">
                <a  href={`/users/${author?.login}`}
                    onClick={(e) => {
                        e.preventDefault();
                        onRouteChange(`user:${author?.id}`);
                    }}

                >   
                    <img src={avatar}  className="post-avatar" />
                </a>
                <div className="post-meta">
                    <p className="post-author">{author?.login}</p>
                    <p className="post-time">{createdAt}</p>
                </div>
            </div>

            <h3 className="post-title">{post?.title}</h3>
            <p className="post-content">{post?.content}</p>

            <div className="bage">
                {(post?.categories && post?.categories.length > 0 ? post?.categories : [{ title: 'no-category', id: 'none' }]).map(cat => (
                    <span key={cat.id} className="category-badge">{cat.title}</span>
                ))}
            </div>

            <div className="post-stats">
                <div className="stat-item" title="Likes">
                    <i className="fa-solid fa-heart" style={{ color: '#cf741aff' }}></i>
                    {likes}
                </div>

                <div className="stat-item" title="Dislikes">
                    <i className="fa-solid fa-heart-crack" style={{ color: '#e42b3eff' }}></i>
                    {dislikes}
                </div>

                <div className="stat-item" title="Rating">
                    <i className="fa-solid fa-star" style={{ color: '#f5c518' }}></i>
                    {rating}
                </div>

                <div className="stat-item" title="Comments">
                    <i className="fa-solid fa-comment" style={{ color: '#71b1e9ff' }}></i>
                    {commentsCount}
                </div>
            </div>
        </div>
    );
}

export default Post;
