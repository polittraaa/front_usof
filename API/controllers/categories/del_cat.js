export async function handleDeleteCat(req, res, db, Cat){
    const { category_id } = req.params;
    const moduleCat = new Cat(db);
    
    try {
        const deleted = await moduleCat.del_cat(category_id);
        
        if (deleted === 0) {
            return res.status(400).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Post deleted successfuly' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not delete post' });  
    }
}