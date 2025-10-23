import { useEffect, useState } from 'react';
import PostDemo from '../PostDemo/PostDemo';
import { useDispatch, useSelector } from "react-redux";
import './Content.css';

import { fetchPosts } from "/src/store/PostFetch.js";

function Content({ onRouteChange, isSignedIn }) {
  const dispatch = useDispatch();

  const {items: posts, status, error, totalPages } = useSelector(
    (state) => state.posts
  );

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("rating"); 
  const [order, setOrder] = useState("desc");
  // const pageSize = 5;

  console.log(page);
  
  useEffect(() => {
   dispatch(fetchPosts({ page, sort, order }))
  }, [page, sort, order, dispatch]);

  
  console.log(page);
  const loading = status === "loading";

  function openPost(id) {
    // link apdate
    // window.history.pushState({}, '', `/posts/${id}`);
    onRouteChange(`post:${id}`);
  }

  return (
    <div className="content-main">
      {loading && !error && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && posts.length === 0 && <p>There are no posts</p>}
      <div className="sorting">
        <button className={`filter mr4 ${sort === "date" ? "active" : ""}`}
          onClick={() => {
            setSort("date");
            setOrder("desc");
            setPage(1);
          }} 
        >
          New
        </button>
        <button  className={`filter ${sort === "rating" ? "active" : ""}`}
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

      <div className="post-list">
        {posts.map(post => (
          <PostDemo key={post.post_id} post={post} isSignedIn={isSignedIn} onOpen={openPost} />
        ))}
      </div>
      

      {!loading && !error && posts.length > 0 && (
        <div className="pagin">
          <button className="arrow" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            ←
            </button>
          <span style={{ margin: '0 0.5rem' }}>page {page} from {totalPages}</span>
          <button className="arrow" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            {console.log(page)}
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default Content;