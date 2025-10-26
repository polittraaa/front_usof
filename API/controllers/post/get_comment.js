export async function getComments(req, res, db, Post) {
    const modulePost = new Post(db);
    const { post_id } = req.params;
    // console.log('in get comments, post id ', post_id)
    try {
        const role = req.userRole; // form middle
        const id = req.session?.userId; // for autor parameter

        const comments = await modulePost.get_comments(role, post_id, id);
        if (comments.length === 0){
            return res.status(200).json({ message: 'No comment to this post yet' });
        }
        res.json({comments})
    }
    catch (err){
        console.error(err);
        res.status(500).json({ error: 'Failed to get comments' });
    }
}