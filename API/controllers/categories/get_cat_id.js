export async function getCatId(req, res, db, Cat){
    const moduleCat = new Cat(db);
    const { category_id } = req.params;
    try {
        const cat = await moduleCat.get_cat_id(category_id);
        res.json({ cat });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get a specific posts' });
    }
}