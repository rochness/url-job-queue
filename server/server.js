var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var handle = require('./request-handler.js');
var morgan = require('morgan');
var path = require('path');
var CronJob = require('cron').CronJob;
var htmlfetcher = require('../workers/htmlfetcher')

// Schedule workers to run every 5 minutes
var job = new CronJob('0 */5 * * * *', function(){
  // console.log('cron job started');
  htmlfetcher.runWorkers();
  });
job.start();

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));
app.use(morgan('default'));

//Request handlers for all routes in app
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

// app.get('/sites', handle.download)
app.get('/site/:id', handle.retrieveSite);
app.post('/sites', handle.addSiteToQueue);

app.use(function (error, req, res, next) {
  console.error(error.stack);
  next(error);
});

app.use(function (error, req, res, next) {
  res.status(500).send({error: error.message});
});


var port = process.env.PORT || 3000;

app.listen(port);