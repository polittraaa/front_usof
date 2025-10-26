export async function getCat(req, res, db, Cat){
    const moduleCat = new Cat(db);
    try {
        const cat = await moduleCat.get_cat();
        res.json({ cat });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get posts' });
    }
}