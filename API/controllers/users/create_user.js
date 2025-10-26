export async function handleNewUser(req, res, db, bcrypt, User) {
   const { email, login, password, password_confirm, full_name, role } = req.body;
   const saltRounds = 10;
   const moduleUser = new User(db);

    try{
        const author_role = req.userRole;
        if (author_role !== "admin"){
            return res.status(403).json({ error: 'Accses denied' });
        }  
        if (password != password_confirm){
            return res.status(400).json({ error: 'passwords must match' });
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const user_id = await moduleUser.create_new_user(login, hash, full_name, email, role);
        const newUser = await moduleUser.find_by_id(user_id);
        console.log(newUser)

        res.json({
            message: "User added: ",
            user: newUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};