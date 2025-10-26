import nodemailer from "nodemailer";

async function sendEmail(email, link, subject, text) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASS,
        }
    });
    const mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: subject,
            text: text
        };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
}
export default sendEmail;