export async function handleCreatetCat(req, res, db, Cat) {
    const moduleCat = new Cat(db);
    const { title } = req.body;

    try { 
        const cat = await moduleCat.new_cat(title);
        res.json(cat);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Can not create new category' });
    }
}