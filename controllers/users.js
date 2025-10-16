const User=require("../models/user.js");
module.exports.renderSignupForm=(req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signUp=async (req,res)=>{
    try{
 const { email, password, username } = req.body;
    if (!username || !email || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/signup");
    }

  // 🔍 Check if user already exists by email
const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      req.flash("error", "User already registered. Try logging in.");
      return res.redirect("/login");
    }
    const newUser=new User({email,username});
    let registeredUser = await User.register(newUser,password); //(username ,password) ✅ fix pass in the hash form
//  .save() ki jagha =>User.register():(User.register() is from passport-local-mongoose)
//Hashes and salts the password automatically (using bcrypt under the hood).
////Saves the user into MongoDB.  ✅
// Returns the saved user object// (registeredUser).
// ===============================================================//
    // when user are login then automatically login 
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
// req.login (from Passport) tries to log in the registeredUser:
// Calls your passport.serializeUser() to decide what to store in the session.
// Stores the user ID in req.session.
// Updates req.user with the full registeredUser.

    req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
    });

   }catch(e){
        // when user are already signup
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};
// ==============================================================//
module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back in WanderLust!");
    const redirectUrl = res.locals.redirectUrl || "/listings"; // ✅ fallback if nothing saved  
    // res.redirect( res.locals.redirectUrl); // but Home page se login krega tb to user authenticate nhi hoga;
    // tb res.redirectUrl||(res.locals.redirectUrl ) empty hoga esliye "/listing pr redirect ho jayenge" 
    res.redirect(redirectUrl);
  };

  module.exports.logOut=(req,res,next)=>{
  req.logout((err)=>{ // if logout krni mi koi error aye to esmi dal do
    if(err){
     return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  })
};