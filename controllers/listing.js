// const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// const mbxGeocogdin = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken= process.env.MAP_TOKEN;
// const GeocogdinClient = mbxGeocoding({ accessToken: mapToken });
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const getCoordinates = require("../utils/geocode");

const Listing=require("../models/listing.js");
module.exports.index=async (req,res)=>{
  // 1. Find ALL listings ({})
    // 2. Ask MongoDB to .sort() them by price.
    //    (price: 1) means ascending (lowest to highest).
    //    (price: -1) would mean descending (highest to lowest).
const allListings = await Listing.find({}).sort({ price: 1 });
  res.render("./listings/index.ejs",{allListings});
 };

 module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  // 🗺️ Get coordinates from Google Geocoding
  const coords = await getCoordinates(req.body.listing.location);

  // 🖼️ Extract image details
  let url = req.file.path;
  let filename = req.file.filename;

  // 🆕 Create listing
  const newList = new Listing(req.body.listing);
  newList.owner = req.user._id;

  // ✅ Add geometry (handle missing coords safely)
  if (coords) {
    newList.geometry = {
      type: "Point",
      coordinates: [coords.lng, coords.lat],
    };
  } else {
    // fallback to prevent validation error
    newList.geometry = {
      type: "Point",
      coordinates: [0, 0],
    };
  }

  // 🖼️ Add image if uploaded
  if (url && filename) {
    newList.image = { url, filename };
  }

  // 💾 Save and redirect
  await newList.save();
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listings");
};

 module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({
                                                      path:"reviews",populate:{path:"author"}
                                                       })
                                                          .populate("owner");
  if (!listing) { 
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); // ✅ return lagao
  }
 res.render('listings/show', { 
  listing, locationIqKey: process.env.LOCATIONIQ_PUBLIC_KEY || process.env.LOCATIONIQ_KEY });

};

module.exports.renderEditForm=async (req,res)=>{
      let {id}=req.params;
     const listing=await Listing.findById(id);
     if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); // ✅ return lagao
       }
     res.render("./listings/edit.ejs",{ listing });
   };

   module.exports.updateListing=async (req, res) => {
    
      let { id } = req.params;
       const updatedData = req.body.listing;
      let listing=await Listing.findByIdAndUpdate(id, { ...updatedData},{ new: true });

      if (updatedData.location) {
    const coords = await getCoordinates(updatedData.location);
    if (coords) {
      listing.geometry = {
        type: 'Point',
        coordinates: [coords.lng, coords.lat],
      };
    } else {
      // fallback to prevent validation error
      listing.geometry = {
        type: 'Point',
        coordinates: [0, 0],
      };
    }
  }

      if( typeof req.file !=="undefined"){ //  if (req.file) 
        let url=req.file.path;
      let filename=req.file.filename;
        listing.image={ url,filename };
         listing.save();
      }
     
      req.flash("success","Listing Updated Sucessfully");
      res.redirect(`/listings/${id}`); // redirect to show page
    };

    module.exports.destroyListing=async (req,res)=>{
      let { id } = req.params;
      let deleteString=await Listing.findByIdAndDelete(id);
      // console.log(deleteString);
      req.flash("success","Listing Deleted Sucessfully!");
      res.redirect("/listings");
   };
   // controller
module.exports.search = async (req, res) => {
   let allListings;
  const searchLocation = req.query.location; // use query for GET
   ;
  if (searchLocation) {
    // case-insensitive partial match
   allListings = await Listing.find({
      location: { $regex: searchLocation, $options: "i" },
    });
  } else {
    // allListings = await Listing.find({});
    req.flash("error", "Rooms are not available");
    return res.redirect("/listings");
  }

  res.render("./listings/index.ejs", { allListings });
};

