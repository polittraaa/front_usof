export async function handleDeletePost(req, res, db, Post) {
    const { post_id } = req.params;
    const userPost = new Post(db);
    
    try {
        const role = req.userRole;
        const id = req.session?.userId;

        const deleted = await userPost.del_post(role, id, post_id);
        
        if (deleted === 0) {
            return res.status(400).json({ error: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfuly' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not delete post' });  
    }
};