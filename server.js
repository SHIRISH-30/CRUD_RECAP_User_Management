//requiring express 
const express=require('express');
const app=express();

//for post request 
app.use(express.urlencoded({extended:true}))
//for handling json 
app.use(express.json());

//requiring dotenv
require('dotenv').config();
//start karne ko dotenv 

//method ovveride 
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

//requiring mongoose
const mongoose=require('mongoose')

//requiring ejs 
const expressLayout=require('express-ejs-layouts');
//views me layout phele se aane ke liye yeh kar rahe
app.use(expressLayout);
app.set('layout','./layouts/main')
app.set('view engine','ejs');

//flash 
const flash=require('connect-flash');

//flash uses sessions
const session=require('express-session');
//use the sessions
app.use(
    session({
        secret:'secretKey',
        resave:false,
        saveUninitialized:true,
        cookie:{
            maxAge:1000*60*60*24*7, //1 week
            }
    })
)
app.use(flash());
//port number 
const port=5000 || process.env.PORT

//public folder for static 
app.use(express.static('public'));

//mongo DB Connection 
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
       
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
connectDB();
//listing to the port 
app.listen(port,(req,res)=>{
    console.log(`LISTENING TO THE http://localhost:${port}/`);
})

app.use('/',require('./server/routes/customers'))

app.get("/about",(req,res)=>{
     res.render('about.ejs')
})

//if koi aur page me gya toh 404 error
app.get('*',(req,res)=>{
    res.status(404).render('error.ejs')
})