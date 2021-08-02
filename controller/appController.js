const bcrypt = require('bcryptjs');
const StudentModel = require('../models/Student.js');
const TeacherModel = require('../models/Teacher');
const Joi = require('joi');
const path = require('path');

exports.homepage_get = (req,res)=> {
    res.sendFile(path.join(__dirname,'../views','home.html'));
};

exports.homepage_post = (req,res)=> {
    res.send('success');
    const {user} = req.body;
    console.log(user);
};


exports.teacher_get = (req,res)=> {
    res.sendFile(path.join(__dirname,'../views','teacher_login.html'));
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

exports.teacher_post_signup = (req,res)=>{
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
            res.send({success: false})
        }
        else
        {
            res.send({success:true});
        }
        
    });
    //Validate if data is correct
    //Check if email already exist 
    //Send failure message if exists
    //else (add the data to the database) and send success message
    console.log(req.body);
    res.send({success:true});
};