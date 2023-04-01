const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const Authen = require("./control/authen");
const flush = require("connect-flash");
const {cartUser} = require("./model/cart")

const app = express();
const { MenuItem} = require("./model/menuItem");
const db = require("./config/db.js");
const { User } = require("./model/user");
const {Admin} = require("./model/admin");
const { Menu } = require('./model/menu');
const at = require("./control/authen");
const atadmin = require("./control/authenadmin");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
db.connect();
app.use(flush());

app.use(express.json());

app.use(session({
    secret: "jklfsodifjsktnwjasdp465dd",
    variableresave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, 
    mongoUrl : ({mongoUrl: "mongodb://127.0.0.1:27017/todolistDB"}),
  }));


  let superHero, batManID, spiderMan;

app.get('/home', at.authentication, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    superHero = user;
    if (user) {
      let mamamia = await cartUser.find();
      console.log(mamamia);
      
      const existingCart = await cartUser.findOne({ userId: superHero._id });

      if (!existingCart) {
        const newCart = new cartUser({ userId: superHero._id, total: 0 });
        await newCart.save();
        batManID = newCart._id;
      } else {
        batManID = existingCart._id;
      }

      res.render('index', { username: user.username });
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin',atadmin.authenticationadmin,async(req,res)=>{
  try{
    const useradmin = await Admin.findById(req.session.userId);
    if(useradmin){
      res.render('admin',{adminname :useradmin.username})
    }else{
      res.redirect('/login-admin');
    }
  }catch(error){
    console.error('Error retrieving user:',error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/login', (req, res) => {
    res.render('login',{message: req.flash('message')})
  })

app.post('/login', async (req,res)=>{
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
        res.redirect('/login')
       
    }
    
})

app.post('/login-admin', async (req,res)=>{
    // Get user input using bodyParser
    const  Adminemail  = req.body.adminEmail;
    const  Adminpassword  = req.body.adminPassword;
    // check if user already exist
    // Validate if user exist in our database
    const oldAdmin = await Admin.findOne({ email: Adminemail, password: Adminpassword });
    console.log(oldAdmin)

    if (oldAdmin) {
        // User already exist >> update session information
        req.session.userId = oldAdmin.id;
        console.log(req.session);
        // console.log(`Username: ${oldAdmin.username}`); // Log the username
        res.redirect('/admin');
       } else {
      
        req.flash('message','Check your email and password.');
        res.redirect('/login-admin')
   
       
    }
    
})

app.post('/logout',(req,res)=>{
    req.session.destroy(function (err) {
        res.redirect('/'); 
    });
})

app.post('/logout-admin',(req,res)=>{
    req.session.destroy(function (err) {
        res.redirect('/login-admin'); 
    });
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/',(req,res)=>{
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

app.get('/login-admin',(req,res)=>{
res.render('login-admin',{message: req.flash('message')})
})


app.post('/register', async(req,res)=>{

    const  email  = req.body.userEmail;
    const  password  = req.body.userPassword;
    const  username = req.body.userName;

    const oldUser = await User.findOne({ email: email, password: password });

    if (oldUser) {
        res.redirect('/login');
       } else {       
        // new user --> add new user to database
        const newUser = new User({ email: email, password: password ,username: username}); 
        newUser.save();
        res.redirect('/login');
    }
})

app.get('/cart-items', async (req, res) => {
  try {
    const cart = await cartUser.findOne({ userId: req.session.userId });
    if (cart) {
      const cartItems = await MenuItem.find({ cartID: cart._id });
      res.json({ cartItems: cartItems });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).send('Internal Server Error');
  }
});
 
app.post("/add-to-cart", async (req, res) => {
  const dataName = req.body.dataName;
  const menu = await Menu.findOne({ name: dataName });

  try {
    if (menu) {
      const spiderMan = await MenuItem.find({ cartID: batManID, name: dataName });

      if (spiderMan.length == 0) {
        let Emoji = new MenuItem({
          cartID: batManID,
          name: menu.name,
          price: menu.price,
          quantity: 0,
          image: menu.image,
        });
        await Emoji.save();
      }

      console.log(`Menu found: ${menu.name}, ${menu.price}, ${menu.description}`);
      res.json({ message: "Menu found" });
    } else {
      console.log(`Menu not found`);
      res.status(404).json({ error: "Menu not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error finding menu" });
  }
});

app.put('/update-quantity', async (req, res) => {
  try {
    const itemId = req.body.id;
    const newQuantity = req.body.quantity;

    const updatedItem = await MenuItem.findByIdAndUpdate(
      itemId,
      { quantity: newQuantity },
      { new: true }
    );

    if (updatedItem) {
      res.json({ message: 'Quantity updated successfully', item: updatedItem });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.delete('/delete-item/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const deletedItem = await MenuItem.findByIdAndDelete(itemId);

    if (deletedItem) {
      res.status(200).send('Item deleted successfully');
    } else {
      res.status(404).send('Item not found');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/image-clicked", (req, res) => {
  const imageId = req.body.id;
  console.log(`Image with ID ${imageId} clicked.`); 
  res.json({ message:`Image ID ${imageId} received.`});
});

app.get('/cart-items', (req, res) => {
  let cartItems = cart.getCart();
  res.json({ cartItems });
});


app.listen("3000", function () {
  console.log("server is listening on port 3000");
});


