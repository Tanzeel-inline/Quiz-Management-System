const mongoose = require('mongoose');
const schema = mongoose.Schema;


const CourseSchema = new schema({
    courseID = schema.Types.ObjectId,
    courseName:{
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    courseCode: {
        type:String,
        maxLength: 10,
        minLength: 3,
        required: true
    },
    teacher: {
        type: schema.Types.ObjectId
    }
    //student: [{type: schema.Types.ObjectId, ref = 'student'}]
});