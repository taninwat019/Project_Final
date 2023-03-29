const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const Authen = require("./control/authen");
const flush = require("connect-flash");

const app = express();
const db = require("./config/db.js");
const { User } = require("./model/user");
const at = require("./control/authen")



app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
db.connect();
app.use(flush());

app.use(express.json());

app.use(session({
    secret: "jklfsodifjsktnwjasdp465dd", // Never ever share this secret in production, keep this in separate file on environmental variable
    variableresave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, //one hour
    mongoUrl : ({mongoUrl: "mongodb://127.0.0.1:27017/todolistDB"}),
  }));

  app.get('/home', at.authentication, async (req, res) => {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.render('index', { username: user.username });
      } else {
        // Handle the case when the user is not found in the database
        res.redirect('/'); // Redirect to the login page or any other page you'd like
      }
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post("/image-clicked", (req, res) => {
    const imageId = req.body.id;
    console.log(`Image with ID ${imageId} clicked.`);
  
    // Perform any required action with the image ID
    // ...
  
    res.json({ message:`Image ID ${imageId} received.`});
  });

 
app.get('/', (req, res) => {
    res.render('login',{message: req.flash('message')})
    
  })

app.post('/', async (req,res)=>{
    // Get user input using bodyParser
    const  email  = req.body.userEmail;
    const  password  = req.body.userPassword;
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email: email, password: password });

    if (oldUser) {
        // User already exist >> update session information
        req.session.userId = oldUser.id;
        console.log(req.session);
        console.log(`Username: ${oldUser.username}`); // Log the username
        res.redirect('/home');
       } else {
        req.flash('message','Check your email and password or register.');
        res.redirect('/')
       
    }
    
})

app.post('/logout',(req,res)=>{
    req.session.destroy(function (err) {
        res.redirect('/'); 
    });
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register', async(req,res)=>{

    const  email  = req.body.userEmail;
    const  password  = req.body.userPassword;
    const  username = req.body.userName;

    const oldUser = await User.findOne({ email: email, password: password });

    if (oldUser) {
        res.redirect('/');
       } else {       
        // new user --> add new user to database
        const newUser = new User({ email: email, password: password ,username: username}); 
        newUser.save();
        res.redirect('/');
       

    }
})

app.get('/guest',(req,res)=>{
    res.render('guest')
})

app.get('/address', (req,res) =>{
  res.render('address')
})

app.get('/payment', (req,res) =>{
  res.render('payment')
})

app.get('/tracking', (req,res) =>{
  res.render('tracking')
})

app.get('/admin', (req, res)=>{
  res.render('admin')
})

  app.listen("3000", function () {
  console.log("server is listening on port 3000");
});
