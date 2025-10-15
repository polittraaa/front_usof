import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
  if (!res.ok) throw new Error("Error loading posts: " + res.status);

  const data = await res.json();
  const posts = Array.isArray(data.posts.posts) ? data.posts.posts : [];

  const postsWithCategories = await Promise.all(
    posts.map(async (post) => {
      // Fetch categories
      const catRes = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${post.post_id}/categories`
      );
      const catData = await catRes.json();

      // Fetch comments
      const comRes = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${post.post_id}/comments`
      );
      const comData = await comRes.json();
      console.log('comData.comments',  comData.comments)

      const commentCount = Array.isArray(comData)
        ? comData.length : comData.comments?.length || 0;
      
      console.log('commentCount', commentCount) 
      return {
        ...post,
        categories: catData,
        comments: comData,
        commentCount,
      };
    })
  );

  return {
    posts: postsWithCategories,
    totalPages: data.page_count,
  };
});

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    totalPages: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.posts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
