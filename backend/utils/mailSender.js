const nodeMailer = require('nodemailer'); // nodemailer package

// function to send mail to User
const mailSender = async (email, title, body) => {
    try{
        let transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from: 'StudyNotion', 
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log(info);
        return info;
    }catch(err) { //bug! bug!
        console.log(`error while mail sending ${err.message}`);
    }
}

module.exports = mailSender;