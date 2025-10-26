export async function handleGetLikes(req, res, db, Post) {
    const modulePost = new Post(db);
    const { post_id } = req.params;
    try {
        const role = req.userRole;
        const id = req.session?.userId;

        const likes = await modulePost.get_likes(role, post_id, id);
        if (likes.length === 0){
            return res.status(200).json({ message: 'No likes to this post yet' });
        }
        res.json({likes}, {count:likes.length})
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: 'Failed to get likes' });
    }
}