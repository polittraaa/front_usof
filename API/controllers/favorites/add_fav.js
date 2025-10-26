export async function addPostFav(req, res, db, Fav) {
    const { post_id } = req.params;
    const modelFav = new Fav(db);
    try {
        const authorId = req.session.userId;

        const fav_post= await modelFav.add_fav(authorId, post_id);
        
        if (fav_post === undefined) {
           return  res.status(200).json({ error: 'Post is not active or does not exist' });
        }

        res.json(fav_post);
    } catch (error) {
        console.error(error);
        if (error.errno === 1062){
            return res.status(200).json({ message: 'This post is already in favorites' });
        }
        res.status(500).json({ error: 'Server error' });
    }
}