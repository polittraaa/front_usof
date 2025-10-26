// export async function handleLikes(req, res, db, Post) {
//     const modulePost = new Post(db);
//     const { post_id } = req.params;
//     const { type } = req.body;
//     try { 
//         // const role = req.userRole; 
//         const id = req.session?.userId;

//         const like = await modulePost.new_like(post_id, id, type);// type aditional
//         res.json(like);
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Can not like' });
//     }
// }

export async function handleLikes(req, res, db, Post) {
  const modulePost = new Post(db);
  const { post_id } = req.params;
  const id = req.session?.userId;
  const { type } = req.body;
  try {
    console.log('Session:', req.session);
    if (!id) return res.status(401).json({ error: 'Not signed in' });

    if (type === 'like') {
      const like = await modulePost.toggleLike(post_id, id, true, type);
      return res.json({ success: true, like });
    } else if (type === 'dislike') {
      const like = await modulePost.toggleLike(post_id, id, false, type);
      return res.json({ success: true, like });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error handling like' });
  }
}
