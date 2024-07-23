const jwt = require('jsonwebtoken');
require('dotenv').config();
const user = require('../models/User');

//authentication

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookie.token || req.body.token || req.header('Authorisation').replace('Bearer', '');
        
        if(!token) {
            return res.status(403).json({
                success: false,
                message: 'Token not provided'
            })
        }

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(err){
            return res.status(401).json({
                success: false,
                message: 'Token Invalid'
            });
        };
        next();
    }catch(err) {
        res.status(500).json({
            success: false,
            message: `error while auth ${err.message}`
        });
    };
};

//isStudent 
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'Student') {
            return res.status(403).json({
                success: false,
                message: 'You are not a student'
            });
        }
        next();
    }catch(err) {
        res.status(500).json({
            success: false,
            message: `Issue while verifying role ${err.message}`
        })
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'Instructor') {
            return res.status(403).json({
                success: false,
                message: 'You are not a Instructor'
            })
        }
        next();
    } catch(err) {
        res.status(500).json({
            success: false,
            message: `Issue while verifying role ${err.message}`
        })
    }
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: `You are not a Admin`
            })
        }
        next();
    } catch(err) {
        res.status(500).json({
            success: false,
            message: `Issue while verifying role ${err.message}`
        })
    }
}