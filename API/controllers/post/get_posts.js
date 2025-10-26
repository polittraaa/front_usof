export async function getPosts(req, res, db, Post) {
  const modulePost = new Post(db);
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const offset = (page - 1) * limit;
    
    const role = req.userRole; // form middle
    const id = req.session?.userId; // for autor parameter
    
    const sort = req.query.sort || "rating";
    const order = req.query.order || "desc";

    const filters = {
      status: req.query.status || null,
      categories: req.query.categories ? req.query.categories.split(',').map(Number) : [],
      date_from: req.query.date_from || null,
      date_to: req.query.date_to || null,
    };
    
    const posts = await modulePost.get_posts(limit, offset, role, id, sort, order, filters);
    const total = await modulePost.count(role, id); // can implement diff count for roles 
    const page_count = Math.ceil(total / limit);
    
    res.json({page, page_count, posts});
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get posts' });
  }
}