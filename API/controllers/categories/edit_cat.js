export async function handleEditCat(req, res, db, Cat) {
    const { category_id } = req.params;
    const moduleCat = new Cat(db);

   try {
        const { title, category_description } = req.body;
        const updates = {};

        if (category_description !== undefined) updates.category_description = category_description;
        if (title !== undefined) updates.title = title;   
        
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        await moduleCat.update_cat(category_id, updates);

        const cat = await moduleCat.get_cat_id(category_id);
        res.send(cat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to edit category' });
    }
};