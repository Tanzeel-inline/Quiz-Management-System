const mongoose = require('mongoose');
const schema = mongoose.Schema;

const studentSchema = new schema({
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
        maxLength: 10,
        minLength: 5,
    },
    contact: {
        type: String,
        length: 11,
    },
    address: {
        type: String,
        maxLength: 100,
    },
    courses: [{
        type: String
    }],
    quiz: [{
        id: String,
        marks: Number
    }]
});

module.exports = mongoose.model("Student",studentSchema);