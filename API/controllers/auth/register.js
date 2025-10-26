import sendEmail from "../../additional_func/send_email.js"

async function handleRegister(req, res, db, bcrypt, jwt, User) {
   const {email, login, password, password_confirm, name} = req.body;
   const saltRounds = 10;
   const moduleUser = new User(db);
   const SECRET = process.env.TOKEN_SECRET;
   const PORT = process.env.SERVER_PORT;
   const token = jwt.sign({email}, SECRET, {expiresIn: "20m"});
   const link = `http://localhost:${PORT}/api/auth/confirm/${token}`

    try{
        if(password != password_confirm){
            res.status(400).json({ error: 'passwords must match' });
        }
        const existingUser = await moduleUser.find_by_login(login);
        if (existingUser) {    
            await sendEmail(
                email, 
                link,
                'Confirm email adress',
                `Clik the link to confirm the email ${link}`
            );
            return res.json({ message: "Email confirmation re-sent" });
        } 
        const hash = await bcrypt.hash(password, saltRounds);
        const user_id = await moduleUser.create_user(login, hash, name, email);
        const newUser = await moduleUser.find_by_id(user_id);
        //mail confirmation
        await sendEmail(
            email,
            link,
            'Confirm email adress',
            `Clik the link to confirm the email ${link}`
        );

        res.json({
            message: "Registration email is sent",
            user: newUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

export default handleRegister;