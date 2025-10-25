// const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// ... (your other requires like dotenv, geocode)
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const getCoordinates = require("../utils/geocode");
const Listing = require("../models/listing.js");

// 1. --- CACHE ---
const NodeCache = require("node-cache");
// Create the cache. stdTTL: 120 means items expire after 120 seconds (2 minutes).
const myCache = new NodeCache({ stdTTL: 120 });// in second's 
// -----------------
 

// 2. --- PAGINATION IMPLEMENTED ---
module.exports.index = async (req, res) => {
    // Get the current page number from the URL query (e.g., /listings?page=2), default to 1
    const page = parseInt(req.query.page) || 1;
    // Set how many listings to show per page
    const listingsPerPage = 20;
    // Calculate how many listings to skip based on the current page
    const skip = (page - 1) * listingsPerPage;

    // Count the total number of listings to calculate total pages
    const totalListings = await Listing.countDocuments();
    const totalPages = Math.ceil(totalListings / listingsPerPage);

    // Fetch only the listings for the current page, sorted by price
    const allListings = await Listing.find({})
        .sort({ price: 1 }) // Sort by price ascending
        .skip(skip)           // Skip listings from previous pages
        .limit(listingsPerPage) // Limit to the number per page
        .lean(); // Use .lean() for faster, plain objects

    // Render the index page, passing the listings and pagination data
    res.render("listings/index.ejs", {
        allListings,
        currentPage: page,  // Pass current page number
        totalPages          // Pass total number of pages
    });
};
// -----------------


module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    const coords = await getCoordinates(req.body.listing.location);
    let url = req.file.path;
    let filename = req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    if (coords) {
        newList.geometry = { type: "Point", coordinates: [coords.lng, coords.lat] };
    } else {
        newList.geometry = { type: "Point", coordinates: [0, 0] }; // Fallback coordinates
    }
    if (url && filename) {
        newList.image = { url, filename };
    }
    await newList.save();
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const cacheKey = `listing_${id}`;
    let cachedListing = myCache.get(cacheKey);

    // --- CACHE CHECK ---
    if (cachedListing) {
        // console.log("CACHE HIT for listing:", id);
        return res.render('listings/show', {
            listing: cachedListing,
            locationIqKey: process.env.LOCATIONIQ_PUBLIC_KEY || process.env.LOCATIONIQ_KEY
        });
    }
    // -------------------

    // console.log("CACHE MISS for listing:", id);
    // Fetch from DB using .lean() for plain object (fixes cache error)
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: { path: "author" }
    })
        .populate("owner")
        .lean(); // Important fix for caching plain objects

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // --- SAVE TO CACHE ---
    myCache.set(cacheKey, listing);
    // ---------------------

    res.render('listings/show', {
        listing,
        locationIqKey: process.env.LOCATIONIQ_PUBLIC_KEY || process.env.LOCATIONIQ_KEY
    });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    // Don't use .lean() here, as the edit form might rely on Mongoose document methods
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const updatedData = req.body.listing;
    let listing = await Listing.findByIdAndUpdate(id, { ...updatedData }, { new: true }); // Get the updated document

    // Update geometry if location changed
    if (updatedData.location) {
        const coords = await getCoordinates(updatedData.location);
        listing.geometry = coords
            ? { type: 'Point', coordinates: [coords.lng, coords.lat] }
            : { type: 'Point', coordinates: [0, 0] }; // Fallback
    }

    // Update image if a new file was uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    // Save potentially updated geometry or image
    await listing.save();


    // --- CACHE INVALIDATION ---
    myCache.del(`listing_${id}`);
    // --------------------------

    req.flash("success", "Listing Updated Sucessfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    // --- CACHE INVALIDATION ---
    myCache.del(`listing_${id}`);
    // --------------------------

    req.flash("success", "Listing Deleted Sucessfully!");
    res.redirect("/listings");
};


// 3. --- PAGINATION FOR SEARCH IMPLEMENTED ---
module.exports.search = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const listingsPerPage = 20;
    const skip = (page - 1) * listingsPerPage;
    // Use req.query.q to match the form's input name='q' if you add autocomplete
    const searchQuery = req.query.location || req.query.q; // Accept 'location' or 'q'

    if (!searchQuery) {
        req.flash("error", "Please enter a location or title to search.");
        return res.redirect("/listings");
    }

    // Search in both location and title, case-insensitive
    const searchFilter = {
        $or: [
            { location: { $regex: searchQuery, $options: "i" } },
            { title: { $regex: searchQuery, $options: "i" } }
        ]
    };

    const totalListings = await Listing.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalListings / listingsPerPage);

    const allListings = await Listing.find(searchFilter)
        .sort({ price: 1 }) // Or sort by relevance if needed
        .skip(skip)
        .limit(listingsPerPage)
        .lean(); // Use .lean() for consistency

    res.render("./listings/index.ejs", {
        allListings,
        currentPage: page,
        totalPages
    });
};
// ------------------------------------


// 4. --- GEOSPATIAL SEARCH (Uses User Location from Query) ---
// In: controllers/listing.js

// --- GEOSPATIAL SEARCH (with Logging) ---
module.exports.searchNearMe = async (req, res) => {

    const { lat, lng } = req.query;

    // --- Log Received Coordinates ---
    console.log("--- searchNearMe ---");
    console.log("Received Query Params:", req.query);
    console.log(`Received Lat: ${lat}, Lng: ${lng}`);
    // --------------------------------

    if (!lat || !lng) {
        req.flash("error", "Could not get your location. Please allow location access.");
        return res.redirect("/listings");
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    // --- Log Parsed Coordinates ---
    console.log(`Parsed Lat: ${userLat}, Lng: ${userLng}`);
    // ----------------------------

    // Validate parsed coordinates                                                                                                                                                                                                                                                                                                                                      
    if (isNaN(userLat) || isNaN(userLng)) {
        console.error("Invalid latitude or longitude after parsing.");
        req.flash("error", "Invalid location data received.");
        return res.redirect("/listings");
    }

    try {
        // Define the geospatial query
        const geoQuery = {
            geometry: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [userLng, userLat] // Ensure [lng, lat] order
                    },
                    $maxDistance: 20000 // 20km radius (Check this value)
                }
            }
        };

        // --- Log the Query Being Sent ---
        console.log("Executing GeoQuery:", JSON.stringify(geoQuery, null, 2));
        // ------------------------------

        // Execute the query
        const nearbyListings = await Listing.find(geoQuery).lean();

        // --- Log Query Results ---
        console.log(`Found ${nearbyListings.length} nearby listings.`);
        if (nearbyListings.length > 0) {
             console.log("First nearby listing title:", nearbyListings[0].title);
        }
        // -------------------------

        // Render the index page with the results
        res.render("listings/index.ejs", {
            allListings: nearbyListings, // Pass the found listings
            currentPage: 1,           // Treat results as page 1
            totalPages: 1            // of 1 total page
        });

    } catch (error) {
        // --- Log Any Database Errors ---
        console.error("!!! Error during geospatial search:", error);
        // -----------------------------
        req.flash("error", "An error occurred while searching for nearby listings.");
        res.redirect("/listings");
    }
};

// --- SIMPLE AUTOCOMPLETE API (using Database Regex) ---
module.exports.getAutocomplete = async (req, res) => {
    // Get the search prefix from the query string (e.g., /listings/autocomplete?q=Goa)
    const prefix = req.query.q || "";

    // Don't search if the prefix is empty
    if (!prefix) {
        return res.json([]); // Return empty array
    }

    try {
        // Create a regex to match listings STARTING with the prefix (case-insensitive)
        // '^' means "starts with" and i means both are currect like GOA goa Goa etc ;
        const regex = new RegExp(`^${prefix}`, 'i');

        // Search DB for titles or locations starting with the prefix
        const matchingListings = await Listing.find({
                $or: [ // Match EITHER title OR location
                    { title: { $regex: regex } },
                    { location: { $regex: regex } }
                ]
            })
            .select('title location -_id') // Get only title/location fields
            .limit(10) // Limit to 10 suggestions
            .lean(); // Use lean for speed

        // Extract unique suggestions from the results
        const suggestions = [...new Set(matchingListings.flatMap(l => [l.title, l.location].filter(Boolean)))];

        // Filter again client-side just to be absolutely sure they start with the prefix
        const filteredSuggestions = suggestions.filter(s => s.toLowerCase().startsWith(prefix.toLowerCase()));

        // Send back up to 10 final suggestions
        res.json(filteredSuggestions.slice(0, 10));

    } catch (error) {
        console.error("Error during autocomplete search:", error);
        res.status(500).json({ error: "Autocomplete search failed" }); // Send error response
    }
};
// ---------------------------------------------

// Export myCache so review controller can use it for invalidation
module.exports.myCache = myCache;