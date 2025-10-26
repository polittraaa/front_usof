export async function getCatIdPost(req, res, db, Cat){
    const moduleCat = new Cat(db);
    const { category_id } = req.params;
    try {
        const cat = await moduleCat.get_cat_id_post(category_id);
        if (cat.length === 0){
            return res.status(200).json({ message: " No posts in this category yet" });
        }
        res.json({ cat });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get a specific posts' });
    }
}