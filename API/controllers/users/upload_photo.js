async function handleAvatar(req, res, db, User) {
    try{
        //check session and file
        const userId  = req.session.userId;
        if (!userId) {
           return res.status(401).json({ error: "Not logged in" });
        }
     
        if (!req.file) {
           return res.status(400).json({ error: "No file uploaded" });
        }
        const photoPath = `/public/uploads/${req.file.filename}`;
        // update db 
        const moduleUser = new User(db);
        await moduleUser.update_photo(userId, photoPath);
        const newUser = await db('users').where({ user_id: userId  }).first();
        
        res.status(200).json({
            message : 'Photo has been updated successfully',
            user: newUser
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user photo' });
    }
};

export default handleAvatar;