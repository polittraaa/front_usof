export default async function updateComment(req, res, db, Comment) {
    try {
        const { comment_id } = req.params;
        const { content, target_state } = req.body;
        const userId = req.session.userId;

        const updates = {};

        if (target_state !== undefined) updates.target_state = target_state;
        if (content !== undefined) updates.content = content;   
        
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const commentModel = new Comment(db);
        const comment = await commentModel.find_by_id(comment_id);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.author_id !== userId) {
            return res.status(403).json({ error: "Forbidden: access denied" });
        }

        const updatedComment = await commentModel.update(comment_id, updates);

        if (!updatedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.json(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}