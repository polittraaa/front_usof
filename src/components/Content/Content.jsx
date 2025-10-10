import { useEffect, useState } from 'react';
import PostDemo from '../PostDemo/PostDemo';

function Content({ onRouteChange }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 10;

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
                if (!res.ok) throw new Error('Error loading posts: ' + res.status);
                const data = await res.json();
               
                const posts = Array.isArray(data.posts.posts) ? data.posts.posts : [];
                console.log(posts);

                const postsWithCategories = await Promise.all(posts.map(async post => {
                    const catRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}/categories`);
                    const catData = await catRes.json();

                    console.log(catData)
                    const comRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}/comments`);
                    const comData = await comRes.json();
                     console.log(comData)

                    const commentsCount = Array.isArray(comData) ? comData.length : (comData.comments?.length || 0);

                    return {
                        ...post,
                        categories: catData.categories || [],
                        commentsCount
                    };                    
                }));
                if (!cancelled) {
                    setPosts(postsWithCategories);
                    setTotalPages(data.totalPages)
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; }
    }, []);    

    function openPost(id) {
        // link apdate
        window.history.pushState({}, '', `/posts/${id}`);
        onRouteChange(`post:${id}`);
    }

    const visible = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    
    return (
        <div 
            className="main-content"
        >
            {loading && !error && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && visible.length === 0 && <p>There are no posts</p>}

            <div className="post-list">
                {visible.map(post => (
                    <PostDemo key={post.id} post={post} onOpen={openPost} />
                ))}
            </div>

            {!loading && !error && visible.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                        ←
                        </button>
                    <span style={{ margin: '0 0.5rem' }}>page {page} from {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                        →
                    </button>
                </div>
            )}
        </div>
    );
}

export default Content;