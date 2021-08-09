const mongoose = require('mongoose');
const schema = mongoose.Schema;


const quizSchema = new schema({
    quizID : schema.Types.ObjectId,
    courseCode: {
        type: String,
        required: true,
    },
    question: [{
        type: String,
        required: true,
    }],
    option1: [{
        type: String,
    }],
    option2: [{
        type: String,
    }],
    option3: [{
        type: String,
    }],
    option4: [{
        type: String,
    }],
    answer: [{
        type: String,
    }],
    totalMark: {
        type: Number,
        require: true
    },
    title: {
        type: String,
        required: true
    }  
    
});

module.exports = mongoose.model("Quiz",quizSchema);