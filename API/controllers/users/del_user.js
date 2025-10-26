async function handleDelete(req, res, db, User) {
    const { user_id } = req.params;
    const userModel = new User(db);
    try {
        await userModel.del_user(user_id);
        res.status(200).json({ message: 'User deleted successfuly' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not delete user' });  
    }
};

export default handleDelete;