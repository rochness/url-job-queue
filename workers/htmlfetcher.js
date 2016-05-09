#!/usr/local/bin/node
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var db = require('../server/db/database');
var Site = require('../server/db/siteModel');

var queue = path.join(__dirname, './jobQueue.txt');

// var readQueue = function(cb) {
//   fs.readFile(queue, function(error, content){
//     if(error){
//       return 'error';
//     } else {
//       var urls = content.toString('utf-8').split("\n");
//       cb(urls);
//     }
//   });
// };

// var downloadUrls = function(urls) {
//   _.each(urls, function(urlandJobInfo) {
//     var info = urlAndJobInfo.split(',');
//     var jobId = info[0];
//     var url = info[1];
//   })
// }

exports.downloadUrl = function(url, jobId, cb) {
  if(url.slice(0,5) !== 'http') {
    url = 'http://' + url;
  }
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      saveUrlToDb(jobId, url, body.toString('utf-8'), cb);
    } else {
      if(error) {
        cb(error);
      }
      console.log('error downloading url, status: ', response.statusCode,  'error: ', error);
    }
  });
}

var saveUrlToDb = function(jobId, url, html, cb) {
  var newSite = new Site({
    jobId: jobId,
    url: url,
    html: html
  });
  newSite.save(function (err, newSite) {
    if (err) {
      // res.send(500, err);
      cb(err);
      console.log('error adding/saving site');
      return;
    } else {
      cb(err, newSite);
      console.log('added site');
    }
  });
}

// var removeUrlFromQueue = function() {

// };


// archive.readListOfUrls(archive.downloadUrls);