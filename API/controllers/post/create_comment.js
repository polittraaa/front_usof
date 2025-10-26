export async function handleComment(req, res, db, Post) {
    const modulePost = new Post(db);
    const { post_id } = req.params;
    const { content } = req.body;
    
    try { 
        const role = req.userRole;
        const id = req.session?.userId;

        const comment = await modulePost.new_comment(post_id, id, content);
        res.json(comment);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Can not create a new comment' });
    }
}