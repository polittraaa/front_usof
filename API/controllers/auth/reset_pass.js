import sendEmail from "../../additional_func/send_email.js"

async function handleReset(req, res, jwt) {
    const { email } = req.body;
    const SECRET = process.env.TOKEN_SECRET;
    const PORT = process.env.SERVER_PORT;
    const FRONTEND_PORT = 5173;
    try{
        const token = jwt.sign({email}, SECRET, {expiresIn: "20m"});
        const link = `http://localhost:${FRONTEND_PORT}/api/auth/password-reset/${token}`;
        sendEmail(email,link,
            'Changing the password ',
            `Clik the link to change the password ${link}`
        );
        res.json({message: "Email is sent"});
    }catch(err) {
        console.error("❌ Detailed error:", err);
        res.status(500).json({ 
        error: "Email could not be sent. Please try again later." 
    });
    }
}

export default handleReset;