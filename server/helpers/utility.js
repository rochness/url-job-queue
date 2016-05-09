var fs = require('fs');
var _ = require('underscore');
var request = require('request');
var db = require('../db/database');
var Site = require('../db/siteModel');
var path = require('path');

var queuePath = path.join(__dirname, '../../workers/jobQueue.txt');

exports.getUrlQueue = function(cb) {
  fs.readFile(queuePath, function(error, content){
    if(error){
      console.log('error reading url queue: ', error)
    } else {
      var nextJobIdAndUrls = content.toString().split("\n");
      cb(nextJobIdAndUrls);
    }
  });
};

exports.completeQueueJobs = function(nextJobIdAndUrls) {
  var urls = nextJobIdAndUrls.slice(1);
  _.each(urls, function(urlInfo) {
    var urlInfo = urlInfo.split(',');
    var jobId = Number(urlInfo[0]);
    var url = urlInfo[1];
    downloadUrl(url, jobId);
  })
  // dequeue items
  exports.getUrlQueue(function(urlQueue) {
    // remove the urls that were just downloaded, but keep the next jobId num
    urlQueue.splice(1,urls.length);
    var updatedQueue = urlQueue.join("\n");
    fs.writeFile(queuePath, updatedQueue, function(error) {
      if(error) {
        console.log('Error writing to job queue after download');
      }
    });
  });
}

var downloadUrl = function(url, jobId) {
  request('http://' + url, function(error, response, body) {
    if (error) {
      console.log('error requesting url: ', error);
    } else if(response.statusCode == 200) {
      saveUrlToDb(jobId, url, body.toString('utf-8'));
    } else {
      console.log('response error requesting url', response.statusCode);
    }
  });
}

var saveUrlToDb = function(jobId, url, html) {
  var newSite = new Site({
    jobId: jobId,
    url: url,
    html: html
  });
  newSite.save(function (err, newSite) {
    if (err) {
      console.log('error adding/saving site');
      return;
    } else {
      console.log('added site');
    }
  });
}

