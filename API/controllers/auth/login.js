async function handleLogin(req, res, db, bcrypt, User) {
    const { email, login, password } = req.body;
    const userModel = new User(db);
    
    try{
        const user = await userModel.find_user(email, login);

        if (!user) {
            return res.status(400).json({ error: 'Invalid email/login or password' });
        }

        if (user) {
            const match  = await bcrypt.compare(password, user.password_hash);
            if (!match) {
                 return res.status(400).json({ error: 'Invalid email/login or password' });
            }
            req.session.userId = user.user_id;
            req.session.visited = true;
            //console.log(`session ${req.session.userId}`);

            res.status(200).json({
                message: 'Login successful',
                user: { user_id: user.user_id, login: user.login, email: user.email, role: user.role }
            });
        }
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Database error' })
    }
};

export default handleLogin;