export default async function deleteComment(req, res, db, Comment) {
    try {
        const { comment_id } = req.params;

        const commentModel = new Comment(db);
        const comment = await commentModel.find_by_id(comment_id);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        await commentModel.delete(comment_id);
        
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}