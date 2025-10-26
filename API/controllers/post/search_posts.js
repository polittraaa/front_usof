export async function searchPosts(req, res, db, Post) {
  const modulePost = new Post(db);
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const offset = (page - 1) * limit;

    const role = req.userRole;
    const id = req.session?.userId;

    const search = req.query.search || ""; // <-- <- here we read the search string
    console.log('querz object:', req.query); // Debug log to see the search query

    const result = await modulePost.search_posts(limit, offset, role, id, search);

    console.log('Search results:', result); // Debug log to see the result structure

    res.json({
      page,
      posts: result.posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search posts' });
  }
}