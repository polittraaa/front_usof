export async function getPost(req, res, db, Post) {
  const modulePost = new Post(db);
  const { post_id } = req.params;
  try {
    const role = req.userRole; // form middle
    const id = req.session?.userId; // for autor parameter

    const post = await modulePost.get_post(role, id, post_id);
    if (post === undefined){
      res.status(404).json({ error: 'Post does not exist' });
    }
    res.json({post});
  }
  catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Failed to get post' });
  }
}