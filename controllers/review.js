const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// --- IMPORTANT ---
// 1. Make sure 'myCache' (from controllers/listing.js) is accessible here.
//    You might need to export it from listing.js and import it here.
//    Example: Add 'module.exports.myCache = myCache;' at the end of listing.js
//             Then add 'const { myCache } = require('./listing.js');' here.
//    If you get an error "myCache is not defined", this import/export is needed.

const { myCache } = require('./listing.js'); // Assuming you exported myCache from listing.js

module.exports.createReview = async (req, res) => { 
    // Find the listing the review belongs to
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Cannot find listing to add review.");
        return res.redirect("/listings");
    }

    // Create a new review object from the form data
    const newReview = new Review(req.body.review);

    // Set the author of the review to the currently logged-in user
    newReview.author = req.user._id;

    // Add the new review's ID to the listing's reviews array
    listing.reviews.push(newReview);

    // Save both the new review and the updated listing
    await newReview.save();
    await listing.save();

    // --- CACHE INVALIDATION ---
    // 2. The listing data has changed (new review added), so delete the old data from the cache.
    if (myCache) {
        myCache.del(`listing_${req.params.id}`);
        console.log(`Cache invalidated for listing after review creation: ${req.params.id}`);
    } else {
        console.log("Warning: myCache object not found for invalidation in createReview.");
    }
    // ----------------------------

    // console.log("new review save");
    req.flash("success", "New Review Created Sucessfully");

    // Redirect back to the listing's show page
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Delete the actual review document
    await Review.findByIdAndDelete(reviewId);

    // --- CACHE INVALIDATION ---
    // 3. The listing data has changed (review removed), delete the old data from the cache.
    if (myCache) {
        myCache.del(`listing_${id}`);
        console.log(`Cache invalidated for listing after review deletion: ${id}`);
    } else {
        console.log("Warning: myCache object not found for invalidation in destroyReview.");
    }
    // ----------------------------

    req.flash("success", "Review Deleted Sucessfully");
    res.redirect(`/listings/${id}`);
};