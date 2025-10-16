const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview=async (req,res)=>{
    const listing=await Listing.findById(req.params.id);
    let  newreview =new Review(req.body.review);
      newreview.author=req.user._id;// jo user hmara login kiya hai wahi hamra review dega to req.user mi uski hi informations hogi;
    await newreview.save();
    listing.reviews.push(newreview); 
    await listing.save();
   //  console.log("new review save");
    req.flash("success","New Review Created Sucessfully");
    res.redirect(`/listings/${listing._id}`);
 };
 module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Sucessfully");
    res.redirect(`/listings/${id}`);
 };
  