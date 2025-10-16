const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");// (../) USE  for start from Root Directary
// const ExpressError=require("../utils/ExpressError.js");


const Review = require("../models/review.js");  
const { validateReview,isLoggedIn,isReviewAuthor } = require("../middleware.js");
const Listing = require("../models/listing.js");
const reviewController=require("../controllers/review.js");

 // Post request for Review(Post review Route) for create route-
router.post("/",isLoggedIn,validateReview,wrapAsync (reviewController.createReview));

 //Post Delete Route for review
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
 module.exports=router;