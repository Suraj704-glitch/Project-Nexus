  if(process.env.Node_ENV!="production"){
  require('dotenv').config()
  }
  const express=require("express");
  const app=express();
  // require listing folder for model
  const mongoose = require('mongoose');
  
  const dbUrl=process.env.ATLASDB_URL;
  // ==================for Authentications===============
    const passport=require("passport");
    const localstrategy=require("passport-local");
    const User=require("./models/user.js"); 


  // =========================== Router===============================
  const listingRouter=require("./routes/listing.js");
  const reviewRouter=require("./routes/review.js"); 
  const userRouter=require("./routes/user.js"); 

  // =========================Middlewares==================================
  const cookieParser = require("cookie-parser");
  const session = require("express-session"); 
  const MongoStore = require('connect-mongo');
  const flash = require("connect-flash");

  // 1️⃣ Cookie parser (optional, for signed cookies)
  app.use(cookieParser());
   const store=MongoStore.create({
    mongoUrl:dbUrl,
      crypto: {
    secret: process.env.SECRET
  },
  touchAfter:26*3600,
   });
   store.on("error",()=>{
    console.log("Error in Mongo Session Store");
   })
  // 2️⃣ Session middleware
  const sessionOptions = session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
    }
  });
  
  app.use(sessionOptions);
  // 3️⃣ Flash middleware (⚠️ session ke baad hi aana chahiye)
  app.use(flash());
  //===passport initilizations taki hmko kisi single sessions mi bar-bar password enter na krna pade 
  app.use(passport.initialize());
  app.use(passport.session()); 

  // ==================authenticate=======================
  const LocalStrategy = require("passport-local");
  passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());  


  //=============================================
  // connect flash as middleware
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;// ye hamre currnt user ki all informations store krki rakhta hai
    next(); 
    
  });

  //==========================================================================
  

  const ExpressError=require("./utils/ExpressError.js");
  main().then(()=>{
      console.log("connected with DB");
  })
  .catch(err => console.log(err));

  async function main() {
    await mongoose.connect(dbUrl);
  };

  const path =require("path");  
  // set the views engain
  app.set("view engine","ejs");
  // set for views when server are started from outside 
  app.set("views",path.join(__dirname,"views"));


  // require the method_Override pakage  
  // is ka use PATCH/PUT/DELETE request dene ki liye krte hai 
  // <form method="POST" action="/chat/:_id?_method=PATCHorPUTorDELETE">
      // <button>submit</button>
  // </form>
  const methodOverride = require("method-override");
  // const { title } = require("process");
    app.use(methodOverride("_method"));

  // set the path for static like .css etc file
  app.use(express.static(path.join(__dirname,"public")));

  // for understanding express when the data come from the user(clint) in the from of url or json
  app.use(express.urlencoded({extended:true}));
  app.use(express.json());
  // require EJS-Mate
  const ejsMate=require("ejs-mate");
  app.engine('ejs',ejsMate);
  
  // ===================================================================
  app.use("/listings",listingRouter);
  app.use("/listings/:id/reviews",reviewRouter);
  app.use("/",userRouter);
  // ===================================================================

  // if all the above Route arenot match that meens user are send the info. at randome route then handle the genrated request
  // Catch-all for unmatched routes
  app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
  });

  app.use((err, req, res, next) => { 
  let { statusCode=500 ,message="Something went Wrong"}=err;
  // ensure defaults
    // const statusCode = err.statusCode || 500;
    // const message = err.message || "Something went wrong";
  res.status(statusCode).render("error.ejs", { message });

  });
  const port=8080;
  app.listen(port,()=>{
      console.log(`port are set properlly at ${port}`);
  });

