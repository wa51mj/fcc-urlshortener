var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = {
  shortUrl: Number, 
  url: String
};

var model = mongoose.model('urlShort', urlSchema);

module.exports = model;