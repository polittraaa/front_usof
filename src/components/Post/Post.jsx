// import React, { useEffect, useState } from 'react';
// import './Post.css';

// function Post({ postId, onRouteChange, isSignedIn, userId }) {
//   const [author, setAuthor] = useState(null);
//   const [post, setPost] = useState(null);
//   const [postCats, setPostCats] = useState([]);
//   const [postComments, setPostComments] = useState([]);
//   const [commentCount, setCommentCount] = useState(0);

//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [rating, setRating] = useState(0);
//   const [userLikeType, setUserLikeType] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [favoriteCount, setFavoriteCount] = useState(0);

//   //for comm 
//   const [showCommentForm, setShowCommentForm] = useState(false);
//   const [newComment, setNewComment] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   // Load post, categories, comments
//   useEffect(() => {
//     if (!postId) return;
//     let cancelled = false;

//     async function loadPost() {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`);
//         if (!res.ok) throw new Error('Error loading post');
//         const data = await res.json();
//         const postData = data.post;        

//         // cat
//         const catRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/categories`);
//         const catData = await catRes.json();

//         // com
//         const comRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`);
//         const comData = await comRes.json();

//         const count = Array.isArray(comData)
//           ? comData.length
//           : comData.comments?.length || 0;

//         // likes
//         const likeRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`);
//         if (!likeRes.ok) throw new Error('Failed to fetch likes');
//         const likeData = await likeRes.json();

//         const likesArr = likeData.likes || [];
//         const likes_count = likesArr.filter(l => l.like_type === 'like').length;
//         const dislikes_count = likesArr.filter(l => l.like_type === 'dislike').length;
//         const newRating = likes_count - dislikes_count;

//         // favs
//         const favRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/favorites`, {
//           credentials: 'include',
//         });
//         if (favRes.ok) {
//           const favData = await favRes.json();
//           const favorites = favData.favorites || [];

//           const count = favorites.length;
//           const isFav = favorites.some(fav => fav.user_id === userId);

//           if (!cancelled) {
//             setFavoriteCount(count);
//             setIsFavorite(isFav);
//           }
//         }
//         if (!cancelled) {
//           setPost(postData);
//           setLikes(likes_count);
//           setDislikes(dislikes_count);
//           setRating(newRating);
//           setPostCats(catData.categories || catData || []);
//           setPostComments(comData.comments || []);
//           setCommentCount(count);
//         }
//       } catch (err) {
//         console.error('Error loading post:', err);
//       }
//     }

//     loadPost();

//     return () => {
//       cancelled = true;
//     };
//   }, [postId]);

//   // Load author
//   useEffect(() => {
//     if (!post?.author_id) return;
//     let cancelled = false;

//     async function loadAuthor() {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${post.author_id}`);
//         if (!res.ok) throw new Error('Error loading author');
//         const data = await res.json();
//         if (!cancelled) setAuthor(data.user || data);
//       } catch (err) {
//         console.error('Error loading author:', err);
//       }
//     }

//     loadAuthor();
//     return () => {
//       cancelled = true;
//     };
//   }, [post?.author_id]);

//   // Load user like status
//   useEffect(() => {
//     if (!isSignedIn || !post?.post_id) return;

//     async function loadUserLike() {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
//           credentials: 'include',
//         });
//         if (!res.ok) throw new Error('Failed to fetch likes');
//         const data = await res.json();
//         const myLike = data.likes?.find(l => l.author_id === userId);
//         if (myLike) setUserLikeType(myLike.type);
//       } catch (err) {
//         console.error('Error loading user like:', err);
//       }
//     }

//     loadUserLike();
//   }, [post?.post_id, isSignedIn, userId]);

//   // Handle like/dislike
//   async function handleLike(type) {    
//     if (!isSignedIn) {
//       onRouteChange('login');
//       return;
//     }

//     try {
//       if (userLikeType === type) {
//         // remove like/dislike
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
//           method: 'DELETE',
//           credentials: 'include',
//         });
//         if (!res.ok) throw new Error('Error when deleting a like');
//         setUserLikeType(null);
//       } else {
//       // add or change like/dislike
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//           body: JSON.stringify({ type }),
//         });
//         console.log(res.json());
        
//         if (!res.ok) throw new Error('Error sending like');
//         setUserLikeType(type);
//       }      

//       // refresh counts
//       const likeRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`);
//       if (!likeRes.ok) throw new Error('Failed to fetch likes');
//       const likeData = await likeRes.json();

//       const likesArr = likeData.likes || [];
//       const likes_count = likesArr.filter(l => l.like_type === 'like').length;
//       const dislikes_count = likesArr.filter(l => l.like_type === 'dislike').length;
//       const newRating = likes_count - dislikes_count;

//       setLikes(likes_count);
//       setDislikes(dislikes_count);
//       setRating(newRating);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || 'Error when changing like');
//     }
//   }

//   async function handleSubmitComment() {
//   if (!isSignedIn) {
//     onRouteChange('login');
//     return;
//   }

//   if (!newComment.trim()) return alert('Comment cannot be empty.');

//   setSubmitting(true);
//   try {
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({
//         content: newComment,
//         user_id: userId,
//       }),
//     });

//     if (!res.ok) throw new Error('Failed to post comment');

//     const data = await res.json();

//     // Add the new comment to state instantly
//     setPostComments(prev => [data.comment || data, ...prev]);
//     setCommentCount(prev => prev + 1);
//     setNewComment('');
//     setShowCommentForm(false);
//   } catch (err) {
//     console.error(err);
//     alert(err.message || 'Error posting comment');
//   } finally {
//     setSubmitting(false);
//   }
// }
  
//   const avatarUrl = author?.picture
//     ? `http://localhost:3001/${author.picture}`
//     : `http://localhost:3001/public/uploads/base_default.png`;

//   const createdAt = post?.publish_date
//     ? new Date(post.publish_date).toLocaleDateString()
//     : '';

//   return (
//     <div className="post">
//       <div className="post-header">
//         <a
//           href={`/users/${author?.login}`}
//           onClick={(e) => {
//             e.preventDefault();
//             onRouteChange(`user:${author?.user_id}`);
//           }}
//         >
//           <img src={avatarUrl} alt="avatar" className="post-avatar" />
//         </a>
//         <div className="post-meta">
//           <p className="post-author">{author?.login}</p>
//           <p className="post-time">{createdAt}</p>
//         </div>
//       </div>

//       <h3 className="post-title">{post?.title}</h3>
//       <p className="post-content">{post?.content}</p>

//       <div className="badge-container ma1">
//         {postCats.length > 0
//           ? postCats.map(cat => (
//               <span key={cat.id} className="category-badge">{cat.title}</span>
//             ))
//           : (<span className="category-badge">no-category</span>)
//         }
//       </div>

//       <div className="post-stats">
//         <div className="stat-item" title="Likes">
//           <i
//             onClick={() => handleLike('like')}
//             className={`fa-solid fa-heart ${userLikeType === 'like' ? 'liked' : ''}`}
//             style={{
//               color: userLikeType === 'like' ? '#cf741a' : '#d5505eff',
//               cursor: 'pointer',
//             }}
//           ></i>
//           {likes}
//         </div>

//         <div className="stat-item" title="Dislikes">
//           <i
//             onClick={() => handleLike('dislike')}
//             className={`fa-solid fa-heart-crack ${userLikeType === 'dislike' ? 'disliked' : ''}`}
//             style={{
//               color: userLikeType === 'dislike' ? '#b30000' : '#470d13ff',
//               cursor: 'pointer',
//             }}
//           ></i>
//           {dislikes}
//         </div>

//         <div className="stat-item" title="Rating">
//           <i className="fa-solid fa-star" style={{ color: '#f5c518' }}></i>
//           {rating}
//         </div>

//         <div className="stat-item" title="Comments">
//           <i className="fa-solid fa-comment" style={{ color: '#908659ff' }}></i>
//           {commentCount}
//         </div>

//         <div className="stat-item" title="Favorites">
//           <i
//             onClick={handleToggleFavorite}
//             className={`fa-solid fa-bookmark ${isFavorite ? 'favorites' : ''}`}
//             style={{
//               color: isFavorite ? '#e6b800' : '#7a7a7a',
//               cursor: 'pointer',
//             }}
//           ></i>
//           {favoriteCount}
//         </div>        
//         <button
//           type="button"
//           className="add-comment-btn"
//           onClick={() => setShowCommentForm(!showCommentForm)}
//         >
//           <i className="fa-solid fa-comment" style={{ color: '#b09961ff' }}></i> +
//         </button>
//       </div>

//       <div className="comment-section">
//         {showCommentForm && (
//           <div className="comment-form">
//             <textarea
//               className="input-field"
//               rows="3"
//               placeholder="Write your comment..."
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//             ></textarea>
//             <button
//               className="submit-comment-btn"
//               onClick={handleSubmitComment}
//               disabled={submitting}
//             >
//               {submitting ? 'Posting...' : 'Submit'}
//             </button>
//           </div>
//         )}

//         {postComments && postComments.map(comment => (
//           <div key={comment.comment_id} className="comment-item">
//             <p>{comment.content}</p>
//             <div className="comment-likes">
//               <div className="stat-item-com" title="Likes">
//                 <i className="fa-solid fa-heart" style={{ color: '#cf741aff' }}></i>
//                 {comment.likes_count || 0}
//               </div>
//               <div className="stat-item-com" title="Dislikes">
//                 <i className="fa-solid fa-heart-crack" style={{ color: '#e42b3eff' }}></i>
//                 {comment.dislikes_count || 0}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }

// export default Post;

import React, { useEffect, useState } from "react";
import "./Post.css";

function Post({ postId, onRouteChange, isSignedIn, userId }) {
  const [author, setAuthor] = useState(null);
  const [post, setPost] = useState(null);
  const [postCats, setPostCats] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [userLikeType, setUserLikeType] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load post, categories, comments, favorites
  useEffect(() => {
    if (!postId) return;
    let cancelled = false;

    async function loadPost() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}`);
        if (!res.ok) throw new Error("Error loading post");
        const data = await res.json();
        const postData = data.post;

        const [catRes, comRes, likeRes, favRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/categories`),
          fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`),
          fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`),
          fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/favorites`, {
            credentials: "include",
          }),
        ]);

        const catData = await catRes.json();
        const comData = await comRes.json();
        const likeData = await likeRes.json();
        const favData = favRes.ok ? await favRes.json() : { favorites: [] };

        const likesArr = likeData.likes || [];
        const likes_count = likesArr.filter((l) => l.like_type === "like").length;
        const dislikes_count = likesArr.filter((l) => l.like_type === "dislike").length;
        const newRating = likes_count - dislikes_count;

        const favorites = favData.favorites || [];
        const favCount = favorites.length;
        const isFav = favorites.some((fav) => fav.user_id === userId);

        const comCount = Array.isArray(comData)
          ? comData.length
          : comData.comments?.length || 0;

        if (!cancelled) {
          setPost(postData);
          setLikes(likes_count);
          setDislikes(dislikes_count);
          setRating(newRating);
          setPostCats(catData.categories || catData || []);
          setPostComments(comData.comments || []);
          setCommentCount(comCount);
          setFavoriteCount(favCount);
          setIsFavorite(isFav);
        }
      } catch (err) {
        console.error("Error loading post:", err);
      }
    }

    loadPost();
    return () => {
      cancelled = true;
    };
  }, [postId, userId]);

  // Load author
  useEffect(() => {
    if (!post?.author_id) return;
    let cancelled = false;

    async function loadAuthor() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${post.author_id}`);
        if (!res.ok) throw new Error("Error loading author");
        const data = await res.json();
        if (!cancelled) setAuthor(data.user || data);
      } catch (err) {
        console.error("Error loading author:", err);
      }
    }

    loadAuthor();
    return () => {
      cancelled = true;
    };
  }, [post?.author_id]);

  // Load user like status
  useEffect(() => {
    if (!isSignedIn || !post?.post_id) return;

    async function loadUserLike() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch likes");
        const data = await res.json();
        const myLike = data.likes?.find((l) => l.author_id === userId);
        if (myLike) setUserLikeType(myLike.type);
      } catch (err) {
        console.error("Error loading user like:", err);
      }
    }

    loadUserLike();
  }, [post?.post_id, isSignedIn, userId]);

  //  Handle like/dislike
  async function handleLike(type) {
    if (!isSignedIn) {
      onRouteChange("login");
      return;
    }

    try {
      if (userLikeType === type) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error removing like");
        setUserLikeType(null);
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ type }),
        });
        if (!res.ok) throw new Error("Error sending like");
        setUserLikeType(type);
      }

      // refresh counts
      const likeRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`);
      const likeData = await likeRes.json();

      const likesArr = likeData.likes || [];
      const likes_count = likesArr.filter((l) => l.like_type === "like").length;
      const dislikes_count = likesArr.filter((l) => l.like_type === "dislike").length;
      const newRating = likes_count - dislikes_count;

      setLikes(likes_count);
      setDislikes(dislikes_count);
      setRating(newRating);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error when changing like");
    }
  }

  // ✅ Handle Toggle Favorite
  async function handleToggleFavorite() {
    if (!isSignedIn) {
      onRouteChange("login");
      return;
    }

    try {
      if (isFavorite) {
        // Remove favorite
        const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites/${postId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to remove favorite");
        setIsFavorite(false);
        setFavoriteCount((prev) => Math.max(prev - 1, 0));
      } else {
        // Add favorite
        const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites/${postId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to add favorite");
        setIsFavorite(true);
        setFavoriteCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert(err.message || "Error updating favorite");
    }
  }

  // ✅ Handle Submit Comment
  async function handleSubmitComment() {
    if (!isSignedIn) {
      onRouteChange("login");
      return;
    }

    if (!newComment.trim()) return alert("Comment cannot be empty.");

    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: newComment,
          user_id: userId,
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment");
      const data = await res.json();

      setPostComments((prev) => [data.comment || data, ...prev]);
      setCommentCount((prev) => prev + 1);
      setNewComment("");
      setShowCommentForm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error posting comment");
    } finally {
      setSubmitting(false);
    }
  }

  const avatarUrl = author?.picture
    ? `http://localhost:3001${author.picture}`
    : `http://localhost:3001/public/uploads/base_default.png`;

  const createdAt = post?.publish_date
    ? new Date(post.publish_date).toLocaleDateString()
    : "";

  return (
    <div className="post">
      <div className="post-header">
        <a
          href={`/users/${author?.login}`}
          onClick={(e) => {
            e.preventDefault();
            onRouteChange(`user:${author?.user_id}`);
          }}
        >
          <img src={avatarUrl} alt="avatar" className="post-avatar" />
        </a>
        <div className="post-meta">
          <p className="post-author">{author?.login}</p>
          <p className="post-time">{createdAt}</p>
        </div>
      </div>

      <h3 className="post-title">{post?.title}</h3>
      <p className="post-content">{post?.content}</p>

      <div className="badge-container">
        {postCats.length > 0
          ? postCats.map((cat) => (
              <span key={cat.id} className="category-badge">
                {cat.title}
              </span>
            ))
          : <span className="category-badge">no-category</span>}
      </div>

      <div className="post-stats">
        <div className="stat-item" title="Likes">
          <i
            onClick={() => handleLike("like")}
            className={`fa-solid fa-heart ${userLikeType === "like" ? "liked" : ""}`}
          ></i>
          {likes}
        </div>

        <div className="stat-item" title="Dislikes">
          <i
            onClick={() => handleLike("dislike")}
            className={`fa-solid fa-heart-crack ${userLikeType === "dislike" ? "disliked" : ""}`}
          ></i>
          {dislikes}
        </div>

        <div className="stat-item" title="Rating">
          <i className="fa-solid fa-star"></i>
          {rating}
        </div>

        <div className="stat-item" title="Comments">
          <i className="fa-solid fa-comment"></i>
          {commentCount}
        </div>

        <div className="stat-item" title="Favorites">
          <i
            onClick={handleToggleFavorite}
            className={`fa-solid fa-bookmark ${isFavorite ? "favorites" : ""}`}
          ></i>
          {favoriteCount}
        </div>

        <button
          type="button"
          className="add-comment-btn"
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          <i className="fa-solid fa-comment"></i> +
        </button>
      </div>

      <div className="comment-section">
        {showCommentForm && (
          <div className="comment-form">
            <textarea
              className="input-field"
              rows="3"
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              className="submit-comment-btn"
              onClick={handleSubmitComment}
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Submit"}
            </button>
          </div>
        )}

        {postComments &&
          postComments.map((comment) => (
            <div key={comment.comment_id} className="comment-item">
              <p>{comment.content}</p>
              <div className="comment-likes">
                <div className="stat-item-com" title="Likes">
                  <i className="fa-solid fa-heart"></i>
                  {comment.likes_count || 0}
                </div>
                <div className="stat-item-com" title="Dislikes">
                  <i className="fa-solid fa-heart-crack"></i>
                  {comment.dislikes_count || 0}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Post;