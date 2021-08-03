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
    courses: [{
        type: schema.Types.ObjectId
    }]
    /*Quiz: {

    }*/
});

module.exports = mongoose.model("Student",studentSchema);