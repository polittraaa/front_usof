import { useEffect, useState } from 'react';
import PostDemo from '../PostDemo/PostDemo';
import './Content.css';

import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "/src/store/PostFetch.js";

function Content({ onRouteChange }) {
    const dispatch = useDispatch();

    const {items: posts, status, error, totalPages } = useSelector(
        (state) => state.posts
    );

    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPosts());
        }
    }, [status, dispatch]);
    
    //pagination    
    const visible = posts.slice((page - 1) * pageSize, page * pageSize);


    function openPost(id) {
        // link apdate
        // window.history.pushState({}, '', `/posts/${id}`);
        onRouteChange(`post:${id}`);
    }
    const loading = status === "loading";

    // console.log(visible.map(p => p.post_id));
    return (
        <div className="content-main">
            {loading && !error && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && visible.length === 0 && <p>There are no posts</p>}
            <div className="sorting">
                <span className="mr3">New</span>
                <span className="mr3">Rating</span>
            </div>
            <div className="post-list">
                {visible.map(post => (
                    <PostDemo key={post.post_id} post={post} onOpen={openPost} />
                ))}
            </div>
            

            {!loading && !error && visible.length > 0 && (
                <div className="pagin">
                    <button className="arrow" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                        ←
                        </button>
                    <span style={{ margin: '0 0.5rem' }}>page {page} from {totalPages}</span>
                    <button className="arrow" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                        →
                    </button>
                </div>
            )}
        </div>
    );
}

export default Content;