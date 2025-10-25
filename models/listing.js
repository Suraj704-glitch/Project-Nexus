  const mongoose=require("mongoose");
  const Review=require("./review.js");
  const { ref } = require("joi");
  const Schema=mongoose.Schema;

  const listingSchema=new Schema({
      title : {
        type: String,
        required:true,
      },
          description :String,
    image:{
      url:String,
      filename:String,
    },

      price:Number,
      location:String,
  geometry: { //GeoJson Formate
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point' ,    // default type for GeoJSON
        required: true     // optional, can remove if you want flexibility
      },
      coordinates: {
        type: [Number],      // [lng, lat]
        default: [0, 0] ,    // fallback coordinates if geocoding fails
        required: true    // optional
      },
    

    },
      country:String,
      reviews:[
        {type :Schema.Types.ObjectId,
          ref:"Review",
        }
      ],
      owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
      }
  });
  listingSchema.index({ geometry: '2dsphere' });
  // Mongoose middleware for delete listing.reviews(delete all the review) when delete the listing . 
  listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}} );
  }});
  module.exports = mongoose.model("listing",listingSchema); 
