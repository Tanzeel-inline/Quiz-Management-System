exports.teacher_dashboard_authenticator = (req, res, next)=> {
    if ( req.session.isTeacher && req.session.isAuth )
    {
        console.log("Authenticator of teacher passed!");
        next();
    }
    else
    {
        res.redirect('/teacher');
    }
};



exports.student_dashboard_authenticator = (req, res, next)=> {
    if ( req.session.isStudent && req.session.isAuth )
    {
        console.log("Authenticator of student passed!");
        next();
    }
    else
    {
        console.log("Authenticator of student failed!");
        res.redirect('/student');
    }
};