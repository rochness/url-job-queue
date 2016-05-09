var fs = require('fs');
var htmlfetcher = require('../workers/htmlfetcher');
var db = require('./db/database');
var Site = require('./db/siteModel');

var nextAvailableJobId = 1;

exports.addSiteToQueue = function(req, res) {
  var url = req.body.url;
  htmlfetcher.downloadUrl(url, nextAvailableJobId, function(err, result) {
    if(err) {
      console.log('error fetching site')
      res.status(500).send(err);
    } else if(result) {
      res.status(200).send({'jobId': nextAvailableJobId});
      nextAvailableJobId++;
    }
  })

  // write url to sites.txt
  // check if site already exists in DB
    // if it does, return job id
  // if not, write to sites.text with job number ',' and url

};

exports.retrieveSite = function(req, res) {
  var jobId = Number(req.params.id);

  if(jobId >= nextAvailableJobId) {
    res.status(500).send('Not a valid job id');
  } else {
    Site.findOne({jobId: jobId})
      .exec(function(err, site) {
        if(err) {
          console.log('error retreiving site: ', err)
          res.status(500).send(err);
        } else {
          // console.log('found site by jobId: ', site)
          res.status(200).send(site.html);
        }
      })
  }
};






