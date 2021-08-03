const bcrypt = require('bcryptjs');
const StudentModel = require('../models/Student.js');
const TeacherModel = require('../models/Teacher');
const Joi = require('joi');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

exports.homepage_get = (req,res)=> {
    //res.cookie("sky", "blue");
    //res.cookie("grass", "green");
    res.sendFile(path.join(__dirname,'../views','home.html'));
    console.log(req.cookies);
};

exports.homepage_post = (req,res)=> {
    res.send('success');
    const {user} = req.body;
    console.log(user);
};


exports.teacher_get = (req,res)=> {
    res.sendFile(path.join(__dirname,'../views','teacher_login.html'));
};


exports.teacher_post = async (req,res)=>{
    const {email,password} = req.body;
    //We don't need to validate password and email? since we will be checking them in the data
    //In case we need to validate the email and password here, verify the data here

    //Teacher can login both using email, we have to check whether the email is correct
    //Email doesn't exist in database
    let teacher = TeacherModel.findOne({email});
    if ( !teacher )
    {
        res.send({success : false});
        return;
    }
    //Email exist in the database, assign session to the user and forward the teacher to the assign courses screen if it's first time login
    //Check the password here
    const pwMatch = await bcrypt.compare(password, teacher.password);
    if ( !pwMatch )
    {
        res.send({success: false});
        return;
    }
    //Creating session variables
    session.isAuth = true;
    session.isTeacher = true;
    session.email = email;
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
        address
    });

    await teacher.save();
    
    console.log(req.body);
    res.send({success:true});
};