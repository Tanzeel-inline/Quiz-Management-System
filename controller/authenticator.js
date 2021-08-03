exports.teacher_dashboard_authenticator = (req, res, next)=> {
    if ( req.session.isTeacher && req.session.isAuth )
    {
        next();
    }
    else
    {
        //Since we are using ajax we can redirect to the page directly from the server we will have to use the res send to the send the signals to the ajax and then it can perform accordingly
        res.send({success : false});
        //res.redirect('/teacher');
    }
};



exports.student_dashboard_authenticator = (req, res, next)=> {
    if ( req.session.isStudent && req.session.isAuth )
    {
        next();
    }
    else
    {
        res.send({success : false});
        //res.redirect('/student');
    }
};