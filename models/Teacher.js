const { bool } = require('joi');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const teacherSchema = new schema({
    userID: schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    contact: {
        type: String,
        length: 11,
    },
    address: {
        type: String,
        maxLength: 100,
    },
    selected_course: {
        type: Boolean,
        default: false,
    },
    courses: [{
        type: schema.Types.ObjectId
    }]
});

module.exports = mongoose.model("Teacher",teacherSchema);