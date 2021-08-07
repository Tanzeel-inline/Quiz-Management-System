const bcrypt = require('bcryptjs');
const StudentModel = require('../models/Student.js');
const TeacherModel = require('../models/Teacher');
const CourseModel = require('../models/Course');
const QuizModel = require('../models/Quiz');
const fs = require('fs');
const Joi = require('joi');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Course = require('../models/Course');

exports.homepage_get = (req,res)=> {
    res.sendFile(path.join(__dirname,'../views','home.html'));
};

exports.homepage_post = (req,res)=> {
    res.send('success');
    const {user} = req.body;
    console.log(user);
};

//Teacher Login session Code
exports.teacher_get = (req,res)=> {
    res.sendFile(path.join(__dirname,'../views','teacher_login.html'));
};

exports.teacher_post = async (req,res)=>{
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
    req.session.email = email;
    res.send({success : true});
};
//Teacher DashBoard session
//First time teacher will have to select courses that he want to teach(need bool var)
//If it's not his first time, then he will be forwarded to teacher_course page
exports.quiz_maker_get = async (req,res)=>{
    let teacher_email = req.session.email;
    //console.log(teacher.teacher_email)
    let course_selected = req.session.course;
    console.log(`Quiz maker get: Course is : ${course_selected}`);
    console.log(`Quiz maker get: Teacher is : ${teacher_email}`);
    let teacher = await TeacherModel.findOne({email: teacher_email});
    //Unknown error, somehow mail of teacher doesn't exist anymore or session contains invalid email
    if ( !teacher )
    {
        req.session.email = null;
        req.session.isAuth = null;
        req.session.isTeacher = null;
        req.session.course = null;
        console.log(`Quiz maker get: Couldn't validate the teacher`);
        res.redirect('http://localhost:3000/teacher');
        return;
    }
    else if ( req.session.course == null )
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
        console.log(`Quiz maker get: Couldn't validate the course`);
        res.redirect('http://localhost:3000/teacher');
        return;
    }
    else
    {
        res.sendFile(path.join(__dirname,'../views','quiz_maker.html'));
    }
};

exports.quiz_maker_post = async(req,res)=> {
    let teacher_email = req.session.email;
    //console.log(teacher.teacher_email)
    let course_selected = req.session.course;
    console.log(`Quiz maker post: Course is : ${course_selected}`);
    console.log(`Quiz maker post: Teacher is : ${teacher_email}`);
    let teacher = await TeacherModel.findOne({email: teacher_email});
    //Unknown error, somehow mail of teacher doesn't exist anymore or session contains invalid email
    if ( !teacher )
    {
        req.session.email = null;
        req.session.isAuth = null;
        req.session.isTeacher = null;
        req.session.course = null;
        console.log(`Quiz maker get: Couldn't validate the teacher`);
        res.redirect('http://localhost:3000/teacher');
        return;
    }
    else if ( req.session.course == null )
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
        
        let quiz_addition = new QuizModel({
            courseCode: course_selected,
            question,
            option1,
            option2,
            option3,
            option4,
            answer
        });
        console.log("Quiz maker post: Quiz saved successfully");
        await quiz_addition.save();
		req.session.course = null;
		res.send({success: true});
        //res.sendFile(path.join(__dirname,'../views','quiz_maker.html'));
    }
};

exports.course_pick_get = async (req,res)=> {
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
};

exports.coures_pick_post = async (req,res)=>{
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
};

exports.student_get = (req,res)=> {
    res.sendFile(path.join(__dirname,'../views','student_login.html'));
};

exports.student_post = (req,res)=> {
    //Validate the user input here
    //Set the session variable if user has given correct credintials
    console.log(req.body);
    //Set success based on whether correct input were given or not
    res.send({success: true});
};

exports.teacher_get_signup = (req,res)=>{
    res.sendFile(path.join(__dirname,'../views','teacher_signup.html')); 
};

exports.teacher_post_signup = async (req,res)=>{
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
};

exports.select_course_get = async (req, res)=>{

    const email = req.session.email;
    console.log(email);
    //Check if teacher exist in database, in case if teacher is removed from database and he does have session variable
    //We will destroy session variable for that teacher and redirect him to login page
    //--------------------Work here to destroy session vairable---------------------------
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

    let teacher_courses = await CourseModel.find({teacher: email});
    var courses_list = [];
    for ( var i = 0 ; i < teacher_courses.length ; i++ )
    {
        courses_list.push(teacher_courses[i].courseCode);
        //console.log(teacher_courses[i].courseCode);
    }
    
    res.render('../views/select_course.ejs', {data : courses_list});
};

exports.select_course_post = async (req, res)=>{
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
};