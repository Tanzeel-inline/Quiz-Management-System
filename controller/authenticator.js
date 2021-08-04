exports.teacher_dashboard_authenticator = (req, res, next)=> {
    if ( req.session.isTeacher && req.session.isAuth )
    {
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
        next();
    }
    else
    {
        res.redirect('/student');
    }
};