// Express Router
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js"); // Error handling utility
const Listing = require("../models/listing.js"); // Mongoose model
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Middleware functions
const listingController = require("../controllers/listing.js"); // Controller functions

// Image upload setup
const multer = require('multer');
const { storage } = require("../cloudCongig.js"); // Cloudinary storage config
const upload = multer({ storage }); // Multer instance for file uploads

// --- Combined Index (GET /) and Create (POST /) Routes ---
router.route("/")
    // GET /listings - Display all listings (with pagination)
    .get(wrapAsync(listingController.index))
    // POST /listings - Create a new listing
    .post(
        isLoggedIn,                 // Check if user is logged in
        upload.single('listing[image]'), // Handle single image upload
        validateListing,            // Validate listing data using Joi
        wrapAsync(listingController.createListing) // Call controller function
    );

// --- Geospatial "Find Near Me" Route ---
 
router.get("/nearme", wrapAsync(listingController.searchNearMe));
// ------------------------------------------
 // when search then find similer then suggess
router.get("/autocomplete", listingController.getAutocomplete);

// --- Search Route ---
// GET /listings/search - Search listings (uses req.query.q or req.query.location)
router.get("/search", wrapAsync(listingController.search));

// --- New Listing Form Route ---
// GET /listings/new - Display the form to create a new listing
router.get("/new",
    isLoggedIn,                 // Check if user is logged in
    listingController.renderNewForm // Call controller function
);

// --- Combined Show (GET /:id), Update (PUT /:id), and Delete (DELETE /:id) Routes ---
router.route("/:id")
    // GET /listings/:id - Display a specific listing (uses cache)
    .get(wrapAsync(listingController.showListing))
    // PUT /listings/:id - Update a specific listing
    .put(
        isLoggedIn,                 // Check login status
        isOwner,                    // Check if user owns the listing
        upload.single('listing[image]'), // Handle optional image upload
        validateListing,            // Validate updated listing data
        wrapAsync(listingController.updateListing) // Call controller function
    )
    // DELETE /listings/:id - Delete a specific listing
    .delete(
        isLoggedIn,                 // Check login status
        isOwner,                    // Check if user owns the listing
        wrapAsync(listingController.destroyListing) // Call controller function
    );

// --- Edit Listing Form Route ---
// GET /listings/:id/edit - Display the form to edit a listing
router.get("/:id/edit",
    isLoggedIn,                 // Check login status
    isOwner,                    // Check if user owns the listing
    wrapAsync(listingController.renderEditForm) // Call controller function
);

module.exports = router; // Export the router