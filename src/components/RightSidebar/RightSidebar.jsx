import './RightSidebar.css'
import { useEffect, useState } from 'react';
import Card from './Card';

import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "/src/store/PostFetch.js";

function RightSidebar({ onRouteChange }) {
  const dispatch = useDispatch();

  const {items: posts, status, error} = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
      if (status === 'idle') {
        dispatch(fetchPosts());
      }
    }, [status, dispatch]);
    
  const hotTopics = (posts || [])
  .filter(p => typeof p?.rating === 'number')
  .sort((a, b) => {
    if (b.rating === a.rating) {
      return b.commentsCount - a.commentsCount;
    }
    return b.rating - a.rating;
  })
  .slice(0, 3);

    function openPost(id) {
    // link apdate
    // window.history.pushState({}, '', `/posts/${id}`);
    onRouteChange(`post:${id}`);
  }

  return(
    <div className="right-bar">
      <h1>Hot Topics</h1>
        <div>
          <div className="post-list">
            {hotTopics.map(post => (
              <Card key={post.post_id} post={post} onOpen={openPost} />
            ))}
        </div>
      </div>
    </div>
  )
}
export default RightSidebar;