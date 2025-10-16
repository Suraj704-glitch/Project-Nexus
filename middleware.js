const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingschema,reviewSchema}=require("./schema.js");// joi Schema

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Only save redirect for GET requests
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl ;  // ye hmara ji url pr jana chahte hai usi pr jayenge 
    }
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

// middleware.js
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) { // this is also exist when user are exist
    res.locals.redirectUrl = req.session.redirectUrl; // ✅ use res.locals
  }
  next();
};
// Listing Authemtications
module.exports.isOwner =async (req, res, next) => {
 let { id } = req.params;
   const listing=await Listing.findById(id);
   if(! listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the owner of this listing");
    return  res.redirect(`/listings/${id}`); 
  }
  next();
};
// Review Authemtications
module.exports.isReviewAuthor =async (req, res, next) => {
 let { id,reviewId } = req.params;
   const review=await Review.findById(reviewId);
   
   if(! review.author._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the Author of this Review");
    return  res.redirect(`/listings/${id}`); 
  }
  next();
};

//  -------------------------- JOI AS Middleware // for server side validations ----------------------------------------//
//  -------------------------- for listingse----------------------------------------//
module.exports.validateListing=(req,res,next)=>{
 // JOI ka use krne pr hamko individual define nhi krna padega;
     const { error }=listingschema.validate(req.body);
   if(error){
      let errmag=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(404,errmag); 
     }else{
      next();
     }
};


//  -------------------------- JOI AS Middleware----------------------------------------//
//  --------------------------for review----------------------------------------//
module.exports.validateReview=(req,res,next)=>{
 // JOI ka use krne pr hamko individual define nhi krna padega;
     const { error }=reviewSchema.validate(req.body);
     if(error){
      let errmag=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(404,errmag); 
     }else{
      next();
     }
};