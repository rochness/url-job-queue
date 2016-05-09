var fs = require('fs');
var util = require('./helpers/utility');
var db = require('./db/database');
var Site = require('./db/siteModel');
var path = require('path');

var queuePath = path.join(__dirname, '../workers/jobQueue.txt');

exports.addSiteToQueue = function(req, res) {
  var url = req.body.url;
  util.getUrlQueue(function(nextJobIdAndUrls) {
    if(!nextJobIdAndUrls) {
      res.status(500).send('Error with reading job queue');
    } else {
      var jobId = Number(nextJobIdAndUrls[0]);
      nextJobIdAndUrls[0] = jobId + 1;
      var newQueue = nextJobIdAndUrls.join("\n") + "\n" + jobId + ',' + url;
      fs.writeFile(queuePath, newQueue, function(error) {
        if(error) {
          console.log('error adding url to queue');
          res.status(500).send(error);
        } else {
          res.status(201).send({jobId: jobId});
        }
      });
    }
  });
};

exports.download = function(req, res) {
  util.getUrlQueue(util.completeQueueJobs);
  res.status(200).send();
}

exports.retrieveSite = function(req, res) {
  var jobId = Number(req.params.id);

  Site.findOne({jobId: jobId})
    .exec(function(err, site) {
      if(err) {
        console.log('error retreiving site: ', err)
        res.status(500).send(err);
      } else if(site === null) {
          res.status(500).send('pending');
        } else {
          res.status(200).send(site.html);
        }
    })
};

