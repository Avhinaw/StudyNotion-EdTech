const User = require('../models/User'); //User model from models
const OTP = require('../models/OTP'); //User model from models
const otpGen = require('otp-generator'); //OTP generator package
const bcrypt = require('bcrypt'); //password Hashing package
const jwt = require('jsonwebtoken'); //token generator package
const nodeMailer = require('nodemailer');
require('dotenv').config(); // process env package

// function to generator otp
exports.sendOTP = async (req, res) => { 
    try{
        const {email} = req.body; // fetching email from req

        const checkUserPresent = await User.findOne({email});// finding email in DB
        if(checkUserPresent){ // if true then user already exist
            return res.status(401).json({
                success: false,
                message: 'User already exists'
            })
        }
        let otp = otpGen.generate(5, { // otpgenrator package to generate otp only numbers of 5 words
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log(`Otp Generated: ${otp}`);

        const otpPayload = {email, otp}; // payload creation for storing otp in DB to get email and the above generated otp

        const otpBody = await OTP.create(otpPayload); // creating an object of OTP in DB
        console.log(otpBody);
        res.status(200).json({ // all fines
            success: true,
            message: 'otp send successfully',
            otp
        });

    }catch(err){ // bug bug
        res.status(500).json({
            success: false,
            message: `OTP sending issue - ${err.message}`
        })
    }
}

// function to signUp User
exports.signUp = async (req, res) => {
    try{
        const {firstName, lastName, email, PhoneNo, password, confirmPassword, accountType, otp} = req.body; // fetching data from req

        if(!firstName || !lastName || !email || !password || confirmPassword || !otp){ // if field blank
            return res.status(403).json({
                success: false,
                message: 'Please provide all required fields'
            })
    }
    if(password!==confirmPassword){ // if both password not match
        return res.status(401).json({
            success: false,
            message: 'Passwords do not match'
        })
    }

    const checkUserPresent = await User.findOne({email}); // finds email from DB
    if(checkUserPresent){ //if email already present then return
        return res.status(401).json({
            success: false,
            message: 'User already exists'
        })
    }

    const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);// sorting to get the most recent otp created using specific email
    console.log(`recentotp: ${recentOtp}`);
    if(recentOtp.length === 0){ // checking is otp length is 0 if then error
        return res.status(401).json({
            success: false,
            message: 'Invalid OTP'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 5);// hashing the password by 5 rounds
    
    const profileDetails = await Profile.create({ // creating profile to store it in additionalDetails
        gender: null,
        dateOfBirth: null,
        about: null,
        PhoneNo: null,
    })

    const user = await User.create({ // creating user instance in User model in DB
        firstName,
        lastName,
        email,
        PhoneNo,
        password: hashedPassword,
        accountType,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}` // dicebear an service to get avatars and so on further
    })

    res.status(200).json({ // fine! fine!
        success: true,
        message: 'User created successfully',
        user
    })

}catch(err) { // bug! bug!
    res.status(500).json({
        success: false,
        message: `User creation issue signup - ${err.message}`
    });
}
}

// function to login User
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body; // fetching data from req
        
        if(!email ||!password){ // if blank
            return res.status(403).json({
                success: false,
                message: 'Please provide all required fields'
            })
        }
        
        const user = await User.findOne({email}).populate('additonalDetails'); // finding recived email in DB is user registered and populate to replace this

        if(!user) { // if email not found in DB
            return res.status(401).json({
                success: false,
                message: 'signup first'
            })
        }

        if (await bcrypt.compare(password, user.password)){ // checking the password stored in DB and the user entered using compare function of bcrypt
            const payload = { // sended with JWT token to authenticate user
                email: user.email,
                id: user._id,
                accountType : user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { // creating token for user
                expiresIn: '2h', // expires after 2hours
            })
            user.token = token; // assigning token to user.token
            user.password = undefined; // password undefined to secure password

const options = {
   expires: new Date(Date.now() + 3*24*60*60*1000), // time after cookie will expire
   httpOnly: true
}
            res.cookie('token', token, options).status(200).json({ // cookie creation using cookie package and giving it jwt token and options like expire...
                success: true,
                token,
                user,
                message: 'Logged in successfully'
            })
        }else{
            return res.status(401).json({ // hacker! hacker!
                success: false,
                message: 'password is incorrect',
            });
        }
        
    }catch(err) { // bug! bug!
        res.status(500).json({
            success: false,
            message: `User login issue - ${err.message}`
        });
    }
}

// function to change password of User by User
exports.changePassword = async (req, res) => {
    try{
        const userDetails = await User.findById(req.user.id)

        const {oldPassword, newPassword} = req.body; // fetching data from req
        
        if(!newPassword){ // if blank
            return res.status(401).json({
                success: false,
                message: `All fields are required`
            })
        }
        const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password); // comparing b/w old and new password
        
        if(!isPasswordMatch){ // if not match
            return res.status(401).json({
                success: false,
                message: 'Old password does not match'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 5);
        const updatePassword = await User.findByIdAndUpdate(
            req.user.id,
            {password: hashedPassword},
            {new: true}
        )

        // send email notification of changed password


        res.status(200).json({ // fine! fine!
            success: true,
            message: 'Password changed successfully'
        })
        
    }catch(err) { // bug! bug!
        res.status(500).json({
            success: false,
            message: 'error while changing password'
        });
    };
};