const Joi = require('joi');  // joi are use for server side validation handling
const review = require('./models/review');
// --------------------------joi validations for listingSchema----------------------------
module.exports.listingschema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),           // ✅ lowercase 'string' & 'required'
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().allow("", null),      // empty ya null allow karega
  }).required(),                             // pura object required
});

// --------------------------joi validations for listingSchema----------------------------
   module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),    // changed
    rating: Joi.number().required().min(1).max(5),
  }).required()
});
