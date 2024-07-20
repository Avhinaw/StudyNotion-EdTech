const mongoose = require('mongoose');


const otpSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60
    },
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    }
});


async function sendVerificationEmail (email, otp) {
    try{
        const mailSender = await mailSender(email, 'Verification Email from StudyNotion', otp);
        console.log('email sent successfully: ', mailResponse);
    }catch(err) {
        console.log(`Error sending verification email ${err.message}`);
        throw err;
    }
}


otpSchema.pre('save', async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})


module.exports = mongoose.model('OTP', otpSchema);