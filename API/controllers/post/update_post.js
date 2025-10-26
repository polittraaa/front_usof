export async function handleUpdatePost(req, res, db, Post) {
   const { post_id } = req.params;
    const modulePost = new Post(db);

   try {
        const { title, post_status, content, image_url, category } = req.body;
        const role = req.userRole;
        const id = req.session?.userId;

        const post_author = await modulePost.get_author(post_id);
         if (!post_author) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const updates = {};

        if (role === 'admin' && post_author.author_id !== id) {
            // Admin but not the post author
            if (post_status !== undefined) updates.post_status = post_status;
            if (category !== undefined) updates.category = category;
        } else if (post_author.author_id === id) {
            if (title !== undefined) updates.title = title;
            if (post_status !== undefined) updates.post_status = post_status;
            if (content !== undefined) updates.content = content;
            if (image_url !== undefined) updates.image_url = image_url;
            if (category !== undefined) updates.category = category;
        } else {
            return res.status(400).json({error: "Access denied" });
        }
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        //func update(field, value)
        await modulePost.update_post(post_id, updates);

        const newPost = await modulePost.get_post(role, id, post_id);
        res.send(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update post' });
    }
};