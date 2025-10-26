export default async function getCommentById(req, res, db, Comment) {
    try {
        const { comment_id } = req.params;
        if (!comment_id) {
            return res.status(400).json({ error: "Comment ID is required" });
        }

        const commentModel = new Comment(db);
        const comment = await commentModel.find_by_id(comment_id);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}