const express = require('express');
const path = require('path');
//To handle the session
const session = require('express-session');
const MongoDBSession = require("connect-mongodb-session")(session);
//Database connection
const connecter = require('./DB/dbconnect');
//To work with hash password
const StudentModel = require('./models/Student.js');
//To hash the password
const bcrypt = require('bcryptjs');
const appController = require('./controller/appController');
const authenticator = require('./controller/authenticator');
const cookieParser = require('cookie-parser');
//const csurf = require('csurf')
//const csurfProtection = csurf({cookie : { httpOnly : true}});
//Database address
const connectionURI = 'mongodb://localhost/qms';
connecter(connectionURI);

//Starting the server
const app = express();
app.use(express.static(path.join(__dirname,'views')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

//To store session variable
const Store = new MongoDBSession({
    url: connectionURI,
    collection: 'qmssession',
});

app.use(session({
    secret: "I have secret key",
    resave: false,
    saveUninitialized: false,
    store: Store,
    cookie: {}
}));


/*app.use((err, req, res, next)=>{
    if ( err.code == "EBADCSRFTOKEN") { return next(err); }
    res.status(403);
    res.send("CSRF attack detected!");
});*/

app.get('/' ,appController.homepage_get);

app.post('/',appController.homepage_post);

app.get('/teacher_signup',appController.teacher_get_signup);

app.post('/teacher_signup',appController.teacher_post_signup);

app.get('/teacher', appController.teacher_get);

app.post('/teacher', appController.teacher_post);

app.get('/teacher_dashboard',authenticator.teacher_dashboard_authenticator,
 appController.teacher_dashboard);

app.get('/student',appController.student_get);

app.post('/student',appController.student_post);

app.get('/test_page',appController.test_pages);


app.listen(3000,console.log(`Listening on port 3000`));
