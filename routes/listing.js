// Express Router
const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");// (../) USE  for start from Root Directary
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const listingController=require("../controllers/listing.js");
// ==========================for Image==========================
const multer  = require('multer');
const { storage }=require("../cloudCongig.js") ;
const upload = multer({ storage });// multer hmare file ko cloudinary ke storage mi store krega;


router.route("/")
// Index Route
.get(wrapAsync(listingController.index))
 // Show new route  
.post(
  isLoggedIn,
   upload.single('listing[image]'),
   validateListing,
   wrapAsync (listingController.createListing)
  );

  // for searching 
  router.get("/search/location", 
    validateListing,
    wrapAsync(listingController.search));

   
// Create Route
//as middleware phle check krega ki hmara user login hai ya nhi if logine hai to hi form ka details lega otherwise /listings pr render ho jayega;
router.get("/new",
  isLoggedIn,
  listingController.renderNewForm
);
 
router.route("/:id")
 //Individual show route
.get( wrapAsync(listingController.showListing))
  // update route
.put(
  isLoggedIn,
  isOwner,
   upload.single('listing[image]'),
   validateListing,
   wrapAsync(listingController.updateListing)
  )
  // Delete Route
 .delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);



   // Edit route
   router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
  );
  
   module.exports=router;