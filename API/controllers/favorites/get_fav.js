export async function getFavorite(req, res, db, Fav){
    const moduleFav = new Fav(db);

    try {
        const id = req.session?.userId; 

        const fav_post = await moduleFav.get_fav(id);
        if (fav_post === undefined){
            return  res.status(200).json({ message: 'No post in fav jet' });
        }
        res.json({fav_post});
    }
    catch (err) { 
        console.error(err);
        res.status(500).json({ error: 'Failed to get post' });
    }
}