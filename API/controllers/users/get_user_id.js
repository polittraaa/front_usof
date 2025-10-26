async function getUser(req, res, db, User) {
    const moduleUser = new User(db);
    const { user_id } = req.params;
    //console.log('Params:', req.params);
    try{
        const user  = await moduleUser.find_by_id(user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to find user' });
    }
}
export default getUser;