export default async function deleteLikeForComment(req, res, db, Comment) {
    try {
        const { comment_id } = req.params;
        const role = req.userRole;
        const id = req.session?.userId;

        const commentModel = new Comment(db);

        const deleted = await commentModel.del_like(role, id, comment_id);

        if (!deleted) {
            return res.status(404).json({ error: "Like not found" });
        }

        res.json({ message: "Like removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}