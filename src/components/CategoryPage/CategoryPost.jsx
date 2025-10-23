import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import PostDemo from '../PostDemo/PostDemo';

import { fetchPosts } from "/src/store/PostFetch.js";

export default function CategoryPage({ catId, onRouteChange }) {
//    const fetchPosts = createAsyncThunk(
//   "posts/fetchPosts",
//   async ({page = 1, sort = "rating", order = "desc", filters = {}} ={}, { getState }) => {
   
//     const limit = 5;
//     const offset = (page - 1) * limit;
    
//     let query = `?page=${page}&limit=${limit}&sort=${sort}&order=${order}`;
//     if (filters.status) query += `&status=${filters.status}`;
//     if (filters.categories?.length) query += `&categories=${filters.categories.join(",")}`;
    
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/posts${query}`);
//     if (!res.ok) throw new Error("Error loading posts: " + res.status);

//     const data = await res.json();
//     const posts = Array.isArray(data.posts.posts) ? data.posts.posts : [];

//     const postsWithCategories = await Promise.all(
//       posts.map(async (post) => {
//         const catRes = await fetch(
//           `${import.meta.env.VITE_API_URL}/posts/${post.post_id}/categories`
//         );
//         const catData = await catRes.json();

//         const comRes = await fetch(
//           `${import.meta.env.VITE_API_URL}/posts/${post.post_id}/comments`
//         );
//         const comData = await comRes.json();

//         const commentCount = Array.isArray(comData)
//           ? comData.length
//           : comData.comments?.length || 0;

//         return {
//           ...post,
//           categories: catData,
//           comments: comData,
//           commentCount,
//         };
//       })
//     );

//     return {
//       posts: postsWithCategories,
//       totalPages: data.page_count,
//     };
//   }
// );
  const dispatch = useDispatch();

  const { items: posts, status, error, totalPages } = useSelector(
    (state) => state.posts
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPosts({
        page,
        filters: { categories: [catId] }
        }));   
    }, [dispatch, catId, page]);

  const openPost = (postId) => {
    onRouteChange(`post:${postId}`);
  };

  const loading = status === "loading";
  return (
    <>
      <h2>Posts in Category #{catId}</h2>

      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div className="post-list mb5">
         {catPosts.map((post) => (
          <PostDemo key={post.post_id} post={post} onOpen={() => openPost(post.post_id)} />
        ))}
      </div>

      {!loading && !error && totalPages > 1 && (
        <div className="pagin">
          <button
            className="arrow"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ←
          </button>
          <span style={{ margin: '0 0.5rem' }}>
            page {page} of {totalPages}
          </span>
          <button
            className="arrow"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
