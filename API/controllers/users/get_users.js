async function getUsers(req, res, db, User) {
    const moduleUser = new User(db);
    try{
        const users  = await moduleUser.get_users();
        res.send(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get users' });
    }
}
export default getUsers;