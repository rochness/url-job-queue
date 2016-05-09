var db = require('./database');
var mongoose = require('mongoose');

var siteSchema = mongoose.Schema({
  url: String,
  html: String,
  jobId: Number
});

var Site = mongoose.model('Site', siteSchema);


module.exports = Site;