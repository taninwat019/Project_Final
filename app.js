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
const { Menu } = require('./model/menu');
const at = require("./control/authen");

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


  let superHero, batManID, mafaka;

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

app.post("/add-to-cart", async (req, res) => {
  const dataName = req.body.dataName;
  const menu = await Menu.findOne({ name: dataName });

  try {
    if (menu) {
      const mafaka = await MenuItem.find({ cartID: batManID, name: dataName });

      if (mafaka.length == 0) {
        let Emoji = new MenuItem({
          cartID: batManID,
          name: menu.name,
          price: menu.price,
          quantity: 1,
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

  






//  let superHero, batManID, mafaka ;

//   app.get('/home', at.authentication, async (req, res) => {

//     try {
//       const user = await User.findById(req.session.userId);
//       superHero = user;
//       if (user) {
//         let mamamia = await cartUser.find()

//         console.log(mamamia)

//            if (cartUser.find({userId: superHero}).length == 0) {

//               const newCart = new cartUser({userId : superHero,total: 0 }) 
//               cartUser.collection.insertOne(newCart)
//               const mafiaSiam = cartUser.find({userId:superHero})
//               batmanID = mmafiaSiam._id

//              }
//         res.render('index', { username: user.username });
//       } else {
//         // Handle the case when the user is not found in the database
//         res.redirect('/'); // Redirect to the login page or any other page you'd like
//       }
//     } catch (error) {
//       console.error('Error retrieving user:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   });



//   app.post("/image-clicked", (req, res) => {
//     const imageId = req.body.id;
//     console.log(`Image with ID ${imageId} clicked.`); 
//     // Perform any required action with the image ID
//     // ...
//     res.json({ message:`Image ID ${imageId} received.`});
//   });


app.post("/add-to-cart",async (req,res)=>{

    
    
    const dataNames = req.body.dataName;  

    mafaka = await MenuItem.find({cartID:batManID,name:dataNames})
    console.log(mafaka)
    console.log(mafaka.length)
    Menu.findOne({ name: dataNames })
        .then((menu) => {
            if (menu) {
                

                if (mafaka.length == 0) {
                    let Emoji = new MenuItem({
                        cartID:batManID,
                        name:menu.name,
                        price:menu.price,
                        quantity:1
                    })
                    MenuItem.collection.insertOne(Emoji)
                }
                
            
                console.log(`Menu found: ${menu.name}, ${menu.price}, ${menu.description}`);
                res.send("Menu found");
            } else {
                console.log(`Menu not found`);
                res.send("Menu not found");
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Error finding menu");
        });
    console.log(dataNames);
})


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

app.post("/add-to-cart", async (req, res) => {
  const dataName = req.body.dataName;
  const menu = await Menu.findOne({ name: dataName });

  try {
    if (menu) {
      const mafaka = await MenuItem.find({ cartID: batManID, name: dataName });

      if (mafaka.length == 0) {
        let Emoji = new MenuItem({
          cartID: batManID,
          name: menu.name,
          price: menu.price,
          quantity: 1,
        });
        await Emoji.save();
      }

      console.log(`Menu found: ${menu.name}, ${menu.price}, ${menu.description}`);
      res.json({ message: "Menu found" });
    } else {
      console.log(`Menu not found`);
      res.status(404).json({ message: "Menu not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error finding menu");
  }
});

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
 

//ChatGPT
app.post("/add-to-cart", async (req, res) => {
  const dataName = req.body.dataName;
  const menu = await Menu.findOne({ name: dataName });

  try {
    if (menu) {
      const mafaka = await MenuItem.find({ cartID: batManID, name: dataName });

      if (mafaka.length == 0) {
        let Emoji = new MenuItem({
          cartID: batManID,
          name: menu.name,
          price: menu.price,
          quantity: 1,
          image: req.body.dataImage, // Add this line
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

app.post("/image-clicked", (req, res) => {
  const imageId = req.body.id;
  console.log(`Image with ID ${imageId} clicked.`); 
  // Perform any required action with the image ID
  // ...
  res.json({ message:`Image ID ${imageId} received.`});
});

app.get('/cart-items', (req, res) => {
  let cartItems = cart.getCart();
  res.json({ cartItems });
});



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
