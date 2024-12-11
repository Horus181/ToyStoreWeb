var mongoose = require('mongoose');
var BrandSchema = mongoose.Schema(
   {
      brandname: {
         type: String,
         required: true,
      },
      country: {
        type: String,
        required: true,
     }
   });
var BrandModel = mongoose.model('brands', BrandSchema); // colec
module.exports = BrandModel;