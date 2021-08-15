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
//Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Quiz API",
            description: "Quiz API Information",
            contact: {
                name: "Tanzeel Ahmed"
            }
        },
        servers: ["http://localhost:3000"]
    },
    apis: ["app.js"]
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);

//Database address
const connectionURI = 'mongodb://localhost/qms';
connecter(connectionURI);

//Starting the server
const app = express();
app.use(express.static(path.join(__dirname,'views')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocs));
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


//Routes
/**
 * @swagger
 * /:
 *  get:
 *      summary: Use to request the homepage
 *      responses:
 *          '200':
 *              description: Opens homepage successfully
 */
app.get('/' ,appController.homepage_get);

/**
 * @swagger
 * /student:
 *  get:
 *      summary: Use to request student login page
 *      responses:
 *          '200':
 *              description: Opens student login page successfully
 */
app.get('/student',appController.student_get);

/**
 *  @swagger
 *  /student:
 *   post:
 *      summary: Logins the student to system and returns the session cookie
 *      consumes: 
 *          - application/json
 *      parameters:
 *          -   in: body
 *              email: user
 *              description: The student to login
 *              schema:
 *                  type: object
 *                  required:
 *                      -   email
 *                      -   password
 *                  properties:
 *                      email: 
 *                          type: String
 *                          example: example@xyz.com
 *                      password:
 *                          type: String,
 *                          maxLength: 5,
 *                          minLength: 10,
 *                          example: 123456
 *              responses: 
 *                  201:
 *                      description: Login'ed to the system
 */
app.post('/student',appController.student_post);

/**
 * @swagger
 * /student_signup:
 *  get:
 *      description: Use to request teacher signup page
 *      responses:
 *          '200':
 *              description: Opens teacher signup page successfully
 */
app.get('/student_signup',appController.student_get_signup);

/**
 *  @swagger
 *  /student_signup:
 *   post:
 *      summary: Creates a new student
 *      consumes: 
 *          - application/json
 *      parameters:
 *          -   in: body
 *              email: user
 *              description: The student want to sign up
 *              schema:
 *                  type: object
 *                  required:
 *                      -   username
 *                      -   email
 *                      -   password
 *                      -   contact
 *                      -   address
 *                  properties:
 *                      username:
 *                          type: String
 *                          example: tornado
 *                      email: 
 *                          type: String
 *                          example: example@xyz.com
 *                      password:
 *                          type: String,
 *                          maxLength: 5,
 *                          minLength: 10,
 *                          example: 123456
 *                      contact:
 *                          type: String,
 *                          length: 11,
 *                          example: 03061515996
 *                      address:
 *                          type: String,
 *                          maxLength: 100,
 *                          example: House No. asd, Street No. 7, Sector No.11-b, Islamabad.
 *              responses: 
 *                  201:
 *                      description: Created a new student
 */
app.post('/student_signup',appController.student_post_signup);

/**
 * @swagger
 * /teacher_signup:
 *  get:
 *      description: Use to request teacher signup page
 *      responses:
 *          '200':
 *              description: Opens teacher signup page successfully
 */
app.get('/teacher_signup',appController.teacher_get_signup);


/**
 *  @swagger
 *  /teacher_signup:
 *   post:
 *      summary: Creates a new teacher
 *      consumes: 
 *          - application/json
 *      parameters:
 *          -   in: body
 *              email: user
 *              description: The teacher want to sign up
 *              schema:
 *                  type: object
 *                  required:
 *                      -   username
 *                      -   email
 *                      -   password
 *                      -   contact
 *                      -   address
 *                  properties:
 *                      username:
 *                          type: String
 *                          example: tornado
 *                      email: 
 *                          type: String
 *                          example: example@xyz.com
 *                      password:
 *                          type: String,
 *                          maxLength: 5,
 *                          minLength: 10,
 *                          example: 123456
 *                      contact:
 *                          type: String,
 *                          length: 11,
 *                          example: 03061515996
 *                      address:
 *                          type: String,
 *                          maxLength: 100,
 *                          example: House No. asd, Street No. 7, Sector No.11-b, Islamabad.
 *              responses: 
 *                  201:
 *                      description: Created a new student
 */
app.post('/teacher_signup',appController.teacher_post_signup);

/**
 * @swagger
 * /teacher:
 *  get:
 *      description: Use to request teacher login page
 *      responses:
 *          '200':
 *              description: Opens teacher login page successfully
 */
app.get('/teacher', appController.teacher_get);


/**
 *  @swagger
 *  /teacher:
 *   post:
 *      summary: Logins the teacher to system and returns the session cookie
 *      consumes: 
 *          - application/json
 *      parameters:
 *          -   in: body
 *              email: user
 *              description: The teacher to login
 *              schema:
 *                  type: object
 *                  required:
 *                      -   email
 *                      -   password
 *                  properties:
 *                      email: 
 *                          type: String
 *                          example: example@xyz.com
 *                      password:
 *                          type: String,
 *                          maxLength: 5,
 *                          minLength: 10,
 *                          example: 123456
 *              responses: 
 *                  201:
 *                      description: Login'ed to the system
 */
app.post('/teacher', appController.teacher_post);

/**
 * @swagger
 * /course_pick:
 *  get:
 *      description: Update the courses of the teacher
 *      responses:
 *          '200':
 *              description: Opens availible courses list for teacher
 */
app.get('/course_pick',authenticator.teacher_dashboard_authenticator,
 appController.course_pick_get);

/**
 *  @swagger
 *  /select_course:
 *   post:
 *      summary: Returns the course of whom teacher wants to make quiz and set the session course to course
 *      consumes: 
 *          - application/json
 *      parameters:
 *          -   in: body
 *              schema:
 *                  type: object
 *                  properties:
 *                      courses_list: 
 *                          type: String
 *                          example: [Management, Marketing]
 *              responses: 
 *                  201:
 *                      description: Teacher teaching the subjects updated in the system
 */
app.post('/course_pick',authenticator.teacher_dashboard_authenticator,
appController.coures_pick_post);

/**
 * @swagger
 * /student:
 *  get:
 *      summary: Use to request a course page for the teacher from where he can select the course of whom he wants to make the quiz
 *      responses:
 *          '200':
 *              description: Opens the list of the courses that teacher is currently teaching
 */
app.get('/select_course',authenticator.teacher_dashboard_authenticator,
appController.select_course_get);

/**
 *  @swagger
 *  /select_course:
 *   post:
 *      summary: Returns the course of whom teacher wants to make quiz and set the session course to course
 *      consumes: 
 *          - application/json
 *      parameters:
 *          -   in: body
 *              schema:
 *                  type: object
 *                  properties:
 *                      course: 
 *                          type: String
 *                          example: Management
 *              responses: 
 *                  201:
 *                      description: Session course updated
 */
app.post('/select_course',authenticator.teacher_dashboard_authenticator,
appController.select_course_post);

/**
 * @swagger
 * /quiz_maker:
 *  get:
 *      summary: Student Attempts the quiz of the selected course and title
 * 		parameters:
 * 			-	out: body
 * 				schema:
 * 					type: object
 * 					properties:
 * 						questions:[
 * 							type: String],
 * 						option1:[
 * 							type: String],
 * 						option2:[
 * 							type: String],
 * 						option3:[
 * 							type: String],
 * 						option4:[
 * 							type: String]
 * 						
 *      responses:
 *          '200':
 *              description: Opens the quiz so that student can attempt it
 */
app.get('/quiz_maker',authenticator.teacher_dashboard_authenticator,
appController.quiz_maker_get);

/**
 * @swagger
 * /quiz_maker:
 *  post:
 *      summary: Student submits the quiz of the selected course and title
 * 		parameters:
 * 			-	out: body
 * 				schema:
 * 					type: object
 * 					properties:
 * 						answer:[
 * 							type: String],
 *      responses:
 *          '200':
 *              description: Opens the quiz so that student can attempt it
 */
app.post('/quiz_maker',authenticator.teacher_dashboard_authenticator,
appController.quiz_maker_post);

app.get('/select_student_course',authenticator.student_dashboard_authenticator,
appController.select_student_course_get);

app.post('/select_student_course',authenticator.student_dashboard_authenticator,
appController.select_student_course_post);

app.get('/pick_student_course',authenticator.student_dashboard_authenticator,
appController.pick_student_course_get);

app.post('/pick_student_course',authenticator.student_dashboard_authenticator,
appController.pick_student_course_post);

app.get('/select_student_title',authenticator.student_dashboard_authenticator,
appController.pick_student_quiz_get);

app.post('/select_student_title',authenticator.student_dashboard_authenticator,
appController.pick_student_quiz_post);


app.get('/quiz_attempt',authenticator.student_dashboard_authenticator,
appController.quiz_attempt_get);

app.post('/quiz_attempt',authenticator.student_dashboard_authenticator,
appController.quiz_attempt_post);

app.get('/logout',appController.logout);

app.get('/quiz_stats',authenticator.student_dashboard_authenticator,
appController.quiz_stat_get);
app.listen(3000,console.log(`Listening on port 3000`));
app.get('/');
