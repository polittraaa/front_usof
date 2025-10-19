import{ useEffect, useState } from 'react';
import './UserPage.css'
import '../PostDemo/PostDemo.css'
import PostDemo from '../PostDemo/PostDemo';

import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "/src/store/PostFetch.js";

function UserPage({ authorId, userId, onRouteChange, isSignedIn}) {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postCats, setPostCats] = useState(null);
  const [postComments, setPostComments] = useState(null);
  const [commentCount, setCommentcount] = useState(null);
  
  const isOwnProfile = authorId === userId;

  //pagination
   const dispatch = useDispatch();

  const {items: posts, status, error, totalPages } = useSelector(
    (state) => state.posts
  );

  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);
  
  
  //fetch user
  useEffect(() => {
    if (!authorId) return;
    let cancelled = false;
    
    async function loadAuthor() {
      try {                
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${authorId}`);
        if (!res.ok) throw new Error('Error loading author');
        const data = await res.json();
        if (!cancelled) setAuthor(data);
      } catch (err) {
        console.error('Error loading author:', err);
      }
    }
    loadAuthor();
    return () => { cancelled = true };
  },[authorId]);

  const userPosts = posts.filter(p => p.author_id === Number(authorId));
  console.log(userPosts)
  
  //pagination    
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const visible = userPosts.slice((page - 1) * pageSize, page * pageSize);
  
  function openPost(id) {
    // link apdate
    // window.history.pushState({}, '', `/posts/${id}`);
    onRouteChange(`post:${id}`);
  }

  console.log(author)
  const memberSince = new Date(author?.created_at).toLocaleDateString(); 
  const avatar = author?.picture ? `http://localhost:3001/${author?.picture}` : 'http://localhost:3001/public/uploads/base_default.png'

  return (
    <div className="user-header">
      <div className="user-info">
        <img src={avatar} className="user-avatar" alt="User avatar" />
        <div className="user-details">
          <p className="user-member">Member since {memberSince}</p>
          <p className="user-name">{author?.login}</p>
          <p className="user-name">{author?.full_name}</p>

          {isOwnProfile && (
            <>
            <p className="user-name">{author?.email}</p>
            <button
              className="edit-profile-btn"
              onClick={() => onRouteChange('edit-profile')}
            >
              Edit Profile
            </button>
            </>
          )}
        </div>
      </div>
    <hr className="user-divider" />
    
    {/* posts */}
    <h2>Post board</h2>
      <div className="post-list mb5">
            {visible.map(post => (
              <PostDemo key={userPosts.post_id} post={post} onOpen={openPost} />
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

export default UserPage;
