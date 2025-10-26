export async function deletePostFav(req, res, db, Fav) {
    const { post_id } = req.params;
    const modelFav = new Fav(db);
    const authorId = req.session.userId;

    if (!authorId) return res.status(401).json({ error: 'Not signed in' });

    try {
        await modelFav.del_fav(authorId, post_id);
        res.json({ message: 'Favorite removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
