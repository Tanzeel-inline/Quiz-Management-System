const TeacherModel = require('../models/Teacher');
const StudentModel = require('../models/Student.js');
exports.teacher_dashboard_authenticator = async (req, res, next)=> {
    if ( req.session.isTeacher && req.session.isAuth )
    {
        
		let teacher = await TeacherModel.findOne({email: req.session.email});
		if ( !teacher )
		{
			req.session.destroy();
			res.redirect('/teacher');
			return;
		}
		console.log("Authenticator of teacher passed!");
        next();
    }
    else
    {
        res.redirect('/teacher');
    }
};



exports.student_dashboard_authenticator = async (req, res, next)=> {
    if ( req.session.isStudent && req.session.isAuth )
    {
		let student = await StudentModel.findOne({email: req.session.email});
		if ( !student )
		{
			req.session.destroy();
			res.redirect('/student');
			return;
		}
		console.log("Authenticator of student passed!");
        next();
    }
    else
    {
        console.log("Authenticator of student failed!");
        res.redirect('/student');
    }
};