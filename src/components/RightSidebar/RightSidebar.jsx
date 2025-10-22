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
  console.log(posts)

  useEffect(() => {
      if (status === 'idle') {
        dispatch(fetchPosts());
      }
    }, [status, dispatch]);
    
    // Top 3 hot topics
  const hotTopics = (posts || [])
    .filter(p => p.rating?.value)       // keep only posts with rating
    .sort((a, b) => b.rating.value - a.rating.value)
    .slice(0, 3);

    console.log(hotTopics)

    function openPost(id) {
    // link apdate
    // window.history.pushState({}, '', `/posts/${id}`);
    onRouteChange(`post:${id}`);
  }



  return(
    <div className="right-bar">
      <h1>Hot Topics</h1>
        <div>
          <div className="post-list mb5">
            {hotTopics.map(post => (
              <Card key={post.post_id} post={post} onOpen={openPost} />
            ))}
        </div>
      </div>
    </div>
  )
}
export default RightSidebar;