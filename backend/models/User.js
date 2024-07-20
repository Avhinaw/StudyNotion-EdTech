const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        requried: true,
        // unique: true,
        trim: true
    },
    PhoneNo: {
        type: Number,
        required: true,
        // unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ['Developer', 'Instructor', 'Student'],
        required: true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    userImg: {
        type: String,
        // default: 'default.jpg'
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CourseProgress',
        }
    ]
});

module.exports = mongoose.model('User', userSchema);