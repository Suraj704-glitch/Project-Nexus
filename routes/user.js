const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signUp))

// ===============================================================================
router.route("/login")
.get(userController.renderLoginForm)
// ========================== for login=============================
// passport.authenticate("local",{failureRedirect:"/login",failurFash:true}) ye hmara automatice hi authenticate kr lega 
.post(saveRedirectUrl, // ✅ this middleware will make res.locals.redirectUrl available
     passport.authenticate("local", {// yha pr hi actual login hoga jo ki hmara passport krwa rha hai;
     failureRedirect: "/login", // if login fails
     failureFlash: true,}),
   userController.login
);
// ===========================================================================
// ================User LogOut using passport=============================
router.get("/logout",userController.logOut);
 module.exports=router;