export default async function getLikesByCommentId(req, res, db, Comment) {
    try {
        const role = req.userRole;
        const { comment_id } = req.params;
        if (!comment_id) {
            return res.status(400).json({ error: "Comment ID is required" });
        }

        const commentModel = new Comment(db);
        const comment = await commentModel.find_by_id(comment_id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        const likes = await commentModel.get_likes(role, comment_id, req.session.userId);

        res.json(likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
