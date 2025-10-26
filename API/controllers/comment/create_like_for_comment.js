export default async function createLikeForComment(req, res, db, Comment) {
    try {
        const { comment_id } = req.params;
        const { type } = req.body;

        if (!["like", "dislike"].includes(type)) {
            return res.status(400).json({ error: "Type must be 'like' or 'dislike'" });
        }

        const authorId = req.session.userId;

        const commentModel = new Comment(db);
        const like = await commentModel.new_like(comment_id, authorId, type);

        res.status(201).json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}