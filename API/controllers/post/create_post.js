export async function handlePost(req, res, db, Post) {
    const modulePost = new Post(db);
    const { title, content, categories } = req.body;
    
    try {
        const id = req.session?.userId;

        const post = await modulePost.new_post(title, content, categories, id);
        res.json({ message: "Post created sucesfully", ...post });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Can not create a new post' });
    }
}