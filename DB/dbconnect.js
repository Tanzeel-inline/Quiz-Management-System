const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session');

//Establish connection to the database with given URL
//Connecting to mongodb using mongoose
const connectDB = async(connectionURI) =>{
    try {
        await mongoose.connect(connectionURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true }).then(res=> {
                console.log('MongoDB connected');
            });
    }
    catch(err) {
        console.log("Something went wrong!!!");
    }
};

module.exports = connectDB;