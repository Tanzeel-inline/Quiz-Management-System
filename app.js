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
//Database address
const connectionURI = 'mongodb://localhost/qms';
connecter(connectionURI);

//Starting the server
const app = express();
app.use(express.static(path.join(__dirname,'views')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//To store session variable
const Store = new MongoDBSession({
    url: connectionURI,
    collection: 'SessionStore',
});

app.use(session({
    secret: "I have secret key",
    resave: false,
    saveUninitialized: false,
    store: Store,
}));


app.get('/',appController.homepage_get);

app.post('/',appController.homepage_post);

app.get('/teacher', appController.teacher_get);

app.get('/student',appController.student_get);

app.post('/student',appController.student_post);

app.get('/teacher_signup',appController.teacher_get_signup);

app.post('/teacher_signup',appController.teacher_post_signup);


app.listen(3000,console.log(`Listening on port 3000`));
