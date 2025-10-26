import sendEmail from "../../additional_func/send_email.js"

async function handleUpdate(req, res, db, jwt, User) {
   const { user_id } = req.params;
   const { full_name, email, login } = req.body;
   const moduleUser = new User(db);
   const PORT = process.env.SERVER_PORT;
   const token = jwt.sign({email}, process.env.TOKEN_SECRET, {expiresIn: "20m"});
   const link = `http://localhost:${PORT}/api/auth/confirm/${token}`

   try{
        let need_email_conf;
        const update = {};
        if (full_name !== undefined) update.full_name = full_name;
        if (login !== undefined) update.login = login;
        if (email !== undefined){
            update.email = email; // handle email verif if changed 
            need_email_conf = true;
        }    
        
        if (Object.keys(update).length === 0) {
            res.status(500).json({message: 'No fields to update'});
        }

        //func update(field, value)
        await moduleUser.update_user(user_id, update, need_email_conf);
        await sendEmail(email, link,
            'Confirm new email adress',
            `Clik the link to confirm the new email ${link}`
        );

        const newUser = await moduleUser.find_by_id(user_id);
         res.json({
            message: "Email is sent",
            user: newUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export default handleUpdate;