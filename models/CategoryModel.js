var mongoose = require('mongoose');
var CategorySchema = mongoose.Schema(
   {
      categoryname: {
         type: String,
         required: true,
      },
      description: {
        type: String,
        required: true,
     }
   });
var CategoryModel = mongoose.model('categories', CategorySchema);
module.exports = CategoryModel;