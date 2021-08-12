const bcrypt = require('bcryptjs');
const Joi = require('joi');
const path = require('path');
const StudentModel = require('../models/Student.js');
const TeacherModel = require('../models/Teacher');
const CourseModel = require('../models/Course');
const QuizModel = require('../models/Quiz');
const Course = require('../models/Course');

exports.homepage_get = (req,res)=> {
    req.session.destroy();
    res.sendFile(path.join(__dirname,'../views','home.html'));
};

exports.homepage_post = (req,res)=> {
    res.send('success');
    const {user} = req.body;
    console.log(user);
};

//Teacher Login session Code
exports.teacher_get = (req,res)=> {
    req.session.destroy();
    res.sendFile(path.join(__dirname,'../views','teacher_login.html'));
};

exports.teacher_post = async (req,res)=>{
    try {
        let {email,password} = req.body;
        email = email.trim();
        password = password.trim();
        //We don't need to validate password and email? since we will be checking them in the data
        //In case we need to validate the email and password here, verify the data here

        //Teacher can login both using email, we have to check whether the email is correct
        //Email doesn't exist in database
        let teacher = await TeacherModel.findOne({email});
        if ( !teacher )
        {
            console.log("Teacher Login: Email not found!");
            res.send({success : false});
            return;
        }
        //Email exist in the database, assign session to the user and forward the teacher to the assign courses screen if it's first time login
        //Check the password here
        const pwMatch = await bcrypt.compare(password, teacher.password);
        if ( !pwMatch )
        {
            console.log(`Teacher Login ${email}: Password didn't match`);
            res.send({success: false});
            return;
        }
        //Creating session variables
        req.session.isAuth = true;
        req.session.isTeacher = true;
        req.session.isStudent = false;
        req.session.email = email;
        res.send({success : true});
    }
    catch (err)
    {
        console.log(err);
        res.send({success : false});
    }
};

//Student Login Code
exports.student_get = (req,res)=> {
    req.session.destroy();
    res.sendFile(path.join(__dirname,'../views','student_login.html'));
};

exports.student_post = async (req,res)=> {
    try
    {
        //Validate the user input here
        //Set the session variable if user has given correct credintials
        console.log(req.body);
        let {email,password} = req.body;
        email = email.trim();
        password = password.trim();

        let student = await StudentModel.findOne({email});

        if ( !student )
        {
            console.log("Student Login Post: Student email not found!");
            res.send({success : false});
            return;
        }
        //Email exist in the database, assign session to the user and forward the teacher to the assign courses screen if it's first time login
        //Check the password here
        const pwMatch = await bcrypt.compare(password, student.password);
        if ( !pwMatch )
        {
            console.log(`Student Login ${email}: Password didn't match`);
            res.send({success: false});
            return;
        }
        //Creating session variables
        req.session.isAuth = true;
        req.session.isStudent = true;
        req.session.isTeacher = false;
        req.session.email = email;
        console.log(`Student Login Post : ${email} logged in successfully!`);
        res.send({success: true});
    } 
    catch(err)
    {
        console.log(err);
        res.send({success : false});
    }
    
    
};

//Teacher quiz making Code
exports.quiz_maker_get = async (req,res)=>{

    try
    {
        let teacher_email = req.session.email;
        //console.log(teacher.teacher_email)
        let course_selected = req.session.course;
        console.log(`[Quiz maker get]: Course is : ${course_selected}`);
        console.log(`[Quiz maker get]: Teacher is : ${teacher_email}`);
        let teacher = await TeacherModel.findOne({email: teacher_email});
        if ( req.session.course == null )
        {
            res.redirect('http://localhost:3000/select_course');
            return;
        }

        let course_validator = await CourseModel.findOne({courseCode: course_selected,
            teacher: teacher_email});
        //Unknown error but will check
        if ( !course_validator )
        {
            req.session.email = null;
            req.session.isAuth = null;
            req.session.isTeacher = null;
            req.session.course = null;
            console.log(`[Quiz maker get]: Couldn't validate the course`);
            res.redirect('http://localhost:3000/teacher');
            return;
        }
        else
        {
            res.sendFile(path.join(__dirname,'../views','quiz_maker.html'));
        }
    }
    catch (err)
    {
        console.log(err);
        res.redirect('http://localhost:3000/teacher');
    }
};

exports.quiz_maker_post = async(req,res)=> {

    try{
        let teacher_email = req.session.email;
        //console.log(teacher.teacher_email)
        let course_selected = req.session.course;
        console.log(`[Quiz maker post]: Course is : ${course_selected}`);
        console.log(`[Quiz maker post]: Teacher is : ${teacher_email}`);
        let teacher = await TeacherModel.findOne({email: teacher_email});
        if ( req.session.course == null )
        {
            res.redirect('http://localhost:3000/select_course');
            return;
        }

        let course_validator = await CourseModel.findOne({courseCode: course_selected,
            teacher: teacher_email});
        
        if ( !course_validator )
        {
            req.session.email = null;
            req.session.isAuth = null;
            req.session.isTeacher = null;
            req.session.course = null;
            console.log(`Quiz maker get: Couldn't validate the course`);
            res.redirect('http://localhost:3000/teacher');
            return;
        }
        //Now we have input here, lets try to save it in quiz schema
        else
        {
            let question = req.body.questions;
            let option1 = req.body.options1;
            let option2 = req.body.options2;
            let option3 = req.body.options3;
            let option4 = req.body.options4;
            let answer = req.body.answers;
            let title = req.body.title_val;
            let totalMark = question.length;
            let quiz_finder = await QuizModel.findOne({title: title});
            if ( quiz_finder )
            {
                res.send({success: false, error : 'Duplicate quiz spotted'});
                return;
            }
            console.log(`[Quiz maker post] : Title is ${title}`);
            let quiz_addition = new QuizModel({
                courseCode: course_selected,
                question,
                option1,
                option2,
                option3,
                option4,
                answer,
                totalMark,
                title
            });

            
            console.log("[Quiz maker post]: Quiz saved successfully");
            await quiz_addition.save();
            req.session.course = null;
            res.send({success: true, error: 'None'});
            //res.sendFile(path.join(__dirname,'../views','quiz_maker.html'));
        }
    } catch(err) {
        console.log(err);
        res.redirect('http://localhost:3000/teacher');
    }
    
};

//Teacher picking the course to make quiz of Code
exports.course_pick_get = async (req,res)=> {
    
    try {
        //Inserting the data in the courses section, uncomment to re insert the data
        /*var obj = require('../courses.json');
        obj.forEach( async function(data){
            let course = new CourseModel({
                courseCode: data.courseCode,
                courseName: data.courseName,
                teacher: "-1"
            });

            await course.save();
        });*/
        var courses_name = [];
        let courses = await CourseModel.find({teacher: "-1"});
        for ( var i = 0 ; i < courses.length ; i++ )
        {
            //console.log(courses[i]._id);
            courses_name.push(courses[i].courseName);
        }

        courses = await CourseModel.find({teacher: req.session.email});
        for ( var i = 0 ; i < courses.length ; i++ )
        {
            //console.log(courses[i]._id);
            courses_name.push(courses[i].courseName);
        }
        res.render('../views/teacher_dashboard.ejs',{data: courses_name});
    } catch(err)
    {
        console.log(err);
        res.redirect('http://localhost:3000/teacher');
    }
};

exports.coures_pick_post = async (req,res)=>{

    try {
        let courses = req.body;
        let teacher = req.session.email;
        //Re-setting the courses of that specific teacher
        let update_course_instructor  = await CourseModel.updateMany({teacher : "-1"}, {teacher : req.session.email});
        //Updating the courses teacher
        update_course_instructor  = await CourseModel.updateMany({teacher : req.session.email}, {teacher:"-1"});
        if ( !update_course_instructor )
        {
            console.log("Couldn't update instructor of previous courses");
        }
        let availible_courses = await CourseModel.find({courseName: courses});
        for ( var i = 0 ; i < availible_courses.length ; i++ )
        {
            if ( availible_courses[i].teacher == '-1' || availible_courses[i].teacher == req.session.email )
            {
                let courseName = availible_courses[i].courseName;
                const update_teacher = await CourseModel.updateOne({courseName: courseName}, {teacher: teacher});
                if ( !update_teacher )
                {
                    console.log(`Couldn't assign course instructor to course ${courseName}`);
                }
            }
            else
            {
                console.log(`${req.session.email} tried to pick wrong course ${availible_courses[i].courseName}`);
            }
        }
        res.send({success : true});
    } catch(err)
    {
        console.log(err);
        res.send({success : false});
    }
    
};


exports.student_get_signup = (req,res)=>{
	res.sendFile(path.join(__dirname,'../views','student_signup.html'));
};

exports.student_post_signup = async (req,res)=>{

    try {
        //Validate if data is correct
        const schema = Joi.object().keys({
            email: Joi.string().trim().email().required() ,
            username: Joi.string().trim().max(60).required() ,
            password: Joi.string().min(5).max(10).required() ,
            contact: Joi.string().length(11).required() ,
            address: Joi.string().max(100).required()
        });
        schema.validate(req.body, (err,result)=>{
            if ( err )
            {
                res.send({success: false});
                return;
            }
        });
        //Check if email already exist 
        const{email,username,password,contact,address} = req.body;
        
        let student = await StudentModel.findOne({email});
        //Send failure message if exists
        if ( student )
        {
            res.send({success: false});
            return;
        }
        //else (add the data to the database) and send success message
        const pwHash = await bcrypt.hash(password, 12);

        student = new StudentModel({
            email,
            username,
            password: pwHash,
            contact,
            address,
        });

        await student.save();
        
        console.log('Student post signup: Student added to the database');
        console.log(req.body);
        res.send({success:true});
    } catch(err)
    {   
        console.log(err);
        res.send({success : false});
    }
	
};
//Teacher Sign up Code
exports.teacher_get_signup = (req,res)=>{
    res.sendFile(path.join(__dirname,'../views','teacher_signup.html')); 
};

exports.teacher_post_signup = async (req,res)=>{

    try {
        //Validate if data is correct
        const schema = Joi.object().keys({
            email: Joi.string().trim().email().required() ,
            username: Joi.string().trim().max(60).required() ,
            password: Joi.string().min(5).max(10).required() ,
            contact: Joi.string().length(11).required() ,
            address: Joi.string().max(100).required()
        });
        schema.validate(req.body, (err,result)=>{
            if ( err )
            {
                res.send({success: false});
                return;
            }
        });
        //Check if email already exist 
        const{email,username,password,contact,address} = req.body;
        
        let teacher = await TeacherModel.findOne({email});
        //Send failure message if exists
        if ( teacher )
        {
            res.send({success: false});
            return;
        }
        //else (add the data to the database) and send success message
        const pwHash = await bcrypt.hash(password, 12);

        teacher = new TeacherModel({
            email,
            username,
            password: pwHash,
            contact,
            address,
        });

        await teacher.save();
        
        console.log('Teacher post signup: Teacher added to the database');
        console.log(req.body);
        res.send({success:true});
    } catch(err)
    {
        console.log(err);
        res.send({success:false});
    }
    
};

//Teacher selecting course to make quiz of Code
exports.select_course_get = async (req, res)=>{

    try {
        const email = req.session.email;
        console.log(email);
        //Check if teacher exist in database, in case if teacher is removed from database and he does have session variable
        //We will destroy session variable for that teacher and redirect him to login page
        //--------------------Work here to destroy session vairable---------------------------
        let teacher = await TeacherModel.findOne({email: req.session.email});

        let teacher_courses = await CourseModel.find({teacher: email});
        var courses_list = [];
        for ( var i = 0 ; i < teacher_courses.length ; i++ )
        {
            courses_list.push(teacher_courses[i].courseCode);
            //console.log(teacher_courses[i].courseCode);
        }
        
        res.render('../views/select_course.ejs', {data : courses_list});
    } catch(err)
    {
        console.log(err);
        res.redirect('http://localhost:3000/teacher');
    }
    
};

exports.select_course_post = async (req, res)=>{

    try{
        const email = req.session.email;
        console.log("I am inside select course post function");
        console.log(email);
        console.log(req.body.course);
        let teacher = await TeacherModel.findOne({email: req.session.email});
        console.log(teacher.username);
        if ( !teacher )
        {
            req.session.email = null;
            req.session.isAuth = null;
            req.session.isTeacher = null;
            req.session.course = null;
            res.redirect('/teacher');
            return;
        }
        req.session.course = req.body.course;
        console.log(req.session.course);
        res.send({success: true});
    } catch(err)
    {
        console.log(err);
        res.send({success: false});
    }
    
};

exports.select_student_course_get = async (req, res)=>
{
    try {
        //Validating the student
        let student = await StudentModel.findOne({email: req.session.email});
        //Displaying all the courses to the student that he picked
        var courses_list = [];
        console.log(`[SELECT STUDENT COURSE GET]: Courses of the students are : ${student.email}`);

        if ( student.courses )
        {
            for ( var i = 0 ; i < student.courses.length ; i++ )
            {
                courses_list.push(student.courses[i]);
            }
        }
        else
        {
            console.log('[SELECT STUDENT COURSE GET]: Redirecting to the Pick course page');
            res.redirect('/pick_student_course');
            return;
        }
        //console.log(`Select student course get: Courses to attempt quiz are : ${courses_list}`);
        res.render('../views/select_student_course.ejs', {data : courses_list});
    } catch(err)
    {
        console.log(err);
        res.redirect('http://localhost:3000/student');
    }
    
};

exports.select_student_course_post = async(req, res)=>{
    try {
        let student = await StudentModel.findOne({email: req.session.email});
        //Setting the session variable for the student, so that we can use it later if the student directly goes to the quiz attempt screen
        console.log(`[Select Student Course Post] : Selected course is : ${req.body.course}`);
        req.session.course = req.body.course;
        console.log(req.session.course);
        res.send({success: true});
    } catch(err)
    {
        console.log(err);
        res.redirect('http://localhost:3000/student');
    }
    
};

exports.pick_student_course_get = async(req, res)=>{
    try {
        //Fetching all the courses from course schema and displaying to the student using ejs file
        var courses_name = [];
        let courses = await CourseModel.find();
        for ( var i = 0 ; i < courses.length ; i++ )
        {
            courses_name.push(courses[i].courseName);
        }
        console.log(`[Pick Student Course Get]: Course to offer to student are : ${courses_name}`);
        res.render('../views/pick_student_course.ejs',{data: courses_name});
    } catch(err)
    {
        console.log(err);
        res.redirect('http://localhost:3000/student');
    }
};

exports.pick_student_course_post = async(req, res)=>{
    try {
        let courses = req.body;
        //Validating the student
        let student = await StudentModel.findOne({email: req.session.email});
        //Updating the student courses
        let update_student_courses = await StudentModel.updateOne({_id: student._id}, {courses: courses});
        if ( !update_student_courses )
        {
            console.log(`Pick student Course Post: Couldn't update the student courses`);
            res.send({success : false});
            return;
        }
        res.send({success : true});
    } catch(err)
    {
        console.log(err);
        res.send({success : false});
    }
    
};

exports.pick_student_quiz_get = async(req,res)=>{

    try {
        var course = req.session.course;
        //Validating the student
        console.log(`[PICK STUDENT QUIZ GET] : VALIDATING THE STUDENT`);
        let student = await StudentModel.findOne({email: req.session.email});
        //Validating the course Code
        console.log(`[PICK STUDENT QUIZ GET] : VALIDATING THE COURSE CODE`);
        let courseCod = await CourseModel.findOne({courseName : course});
        if ( !courseCod || courseCod.length <= 0 )
        {
            res.send({success: false, error: 'Wrong course'});
            return;
        }
        //Validating whether the quiz for that subject exist or not
        console.log(`[PICK STUDENT QUIZ GET] : FETCHING THE QUIZZES FOR THE COURSE CODE`);
        let quizzes = await QuizModel.find({courseCode: courseCod.courseCode});
        if ( !quizzes || quizzes.length <= 0 )
        {
            res.send({success: false, error: 'No quiz of course exist'});
            return;
        }
        console.log(`Availible quizzes are : ${quizzes}`);

        //Fetching all the quizzes for that course
        var quizzes_name = [];
        for ( var i = 0 ; i < quizzes.length ; i++ )
        {
            quizzes_name.push(quizzes[i].title);
        }
        //Rendering the html page to select the one quiz
        res.render('../views/select_student_title.ejs',{data : quizzes_name});
    } catch(err)
    {
        console.log(err);
        res.redirect('http://localhost:3000/student');
    }
    
};

exports.pick_student_quiz_post = async(req, res)=>{
    try {
        console.log(`[Select student quiz post] : ${req.session.email} tried to attempt quiz`);
        console.log(`[Select student quiz post] : Title is : ${req.body.title}`);
        //Validating the student
        let student = await StudentModel.findOne({email: req.session.email});

        //Setting the session variable for the student, so that we can use it later if the student directly goes to the quiz attempt screen
        console.log(`[Select Student Quiz Post] : Selected title is : ${req.body.title}`);
        req.session.title = req.body.title;
        console.log(req.session.title);
        res.send({success: true});
    } catch(err)
    {
        console.log(err);
        res.send({success: false});
    }
    
};

exports.quiz_attempt_get = async(req,res)=>{
    try{
        //Tried to select the wrong course
        console.log(`[Quiz attempt get]: ${req.session.course}`);
        let course = await CourseModel.findOne({courseName: req.session.course});
        if ( !course )
        {
            res.send({success: false, error: 'No such course exist'});
            return;
        }
        console.log(`[Quiz attempt get]: Course Code for the selected course is ${course.courseCode}`);

        //Checking if quiz exists for that course or not
        let quiz = await QuizModel.findOne({courseCode: course.courseCode, title: req.session.title});

        req.session.quiz_id = quiz._id;
        console.log(`[Quiz attempt get]: Course Code for the selected course is ${course.courseCode}`);

        if ( !quiz )
        {
            res.send({success: false, error: 'No quiz made yet! Try again later'});
            return;
        }

        console.log(`Quiz length is : ${quiz.length}`);
        let questions = quiz.question;
        let options1 = quiz.option1;
        let options2 = quiz.option2;
        let options3 = quiz.option3;
        let options4 = quiz.option4;
        console.log(`[Quiz attempt get]: Availible quizzes are : ${questions}`);
        var data = [];
        for ( var i = 0 ; i < questions.length ; i++ )
        {
            data.push({question: questions[i] , option1: options1[i], option2: options2[i], option3: options3[i], option4: options4[i]});
        }
        JSON.stringify(data);
        console.log(`[Quiz attempt get]: ${data}`);
        for ( var i = 0 ; i < data.length ; i++ )
        {
            console.log(`${data[i].question}`);
        }
        res.render('../views/quiz_attempt.ejs',{data : data});
    } catch(err)
    {
        console.log(err);
        res.redirect('http://localhost:3000/student');
    }
    
};

exports.quiz_attempt_post = async(req, res)=>{

    try {
        console.log(`[QUIZ ATTEMPT POST]:\nMy running\n`);
    
        //Validating the student
        let student = await StudentModel.findOne({email: req.session.email});
        //Getting the answer sheet from the student
        const {answers} = req.body;
        console.log(`[QUIZ ATTEMPT POST]:\nAnswer sheet: ${answers}\n`);
        let total_point = 0;
        
        //Calculating the student marks
        let quiz = await QuizModel.findOne({_id : req.session.quiz_id});
        if ( !quiz )
        {
            res.send({success: false});
        }
        let answers_sheet = quiz.answer;
        console.log(`[QUIZ ATTEMPT POST]:\n Actual Answer sheet: ${answers}\n`);
        for ( var i = 0 ; i < answers_sheet.length ; i++ )
        {
            if ( answers[i] )
            {
                if ( answers_sheet[i] == answers[i] )
                {
                    total_point++;
                }
                console.log(answers_sheet[i]);
            }
        }
        var newQuiz = {id: student._id + '' , marks: total_point};
        student.quiz.push(newQuiz);
        await student.save();
        //Adding the attempt quiz in student database
        StudentModel.updateOne({_id : student._id},{$push: {}})
        console.log(`[QUIZ ATTEMPT POST]:\nTotal points: ${total_point}\n`);
        res.send({success : true});
    } catch(err)
    {
        console.log(err);
        res.redirect('http://localhost:3000/student');
    }
    
}

exports.logout = async(req,res)=>{
	req.session.destroy();
	res.redirect('/');
};