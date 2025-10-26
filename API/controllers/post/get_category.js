export async function handleGetCategories(req, res, db, Post) {
    const modulePost = new Post(db);
    const { post_id } = req.params;
    
    try {
        const cat = await modulePost.get_category(post_id);
        res.json(cat);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Can not get associated category' });
    }
} 