import nodemailer from 'nodemailer'
import 'dotenv/config'

var transport = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: `${process.env.SMTP_USER}`,
        pass: `${process.env.SMTP_PASS}`
    }
});


export default transport