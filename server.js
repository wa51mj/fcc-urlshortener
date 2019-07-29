'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var dns = require('dns');
var mongo = require('mongodb');
var mongoose = require('mongoose');

let {isUrlValid} = require('./validateUrl.js')
let create = require('./crud/create')
let read = require('./crud/read')
let getShortUrl = require('./shortUrl')


var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected')
});

app.use(cors());


/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

let apiRoute = "/api/shorturl/:url";
  
// to deal with POST requests
app.get(apiRoute, async function (req, res) {
  console.log(`redirect request \n`)
  let shortUrlRequest = req.params.url;
  let searchResult = await read(parseInt(shortUrlRequest));
  let url = (searchResult) ? searchResult.url : "../.."; // "../.." will send back to [project_url]
  res.redirect(url);
});

app.post(apiRoute, async function (req, res) {
  let response = {};
  
  let urlToTest = req.body.url;
  let validUrl =  await isUrlValid(urlToTest);

  if(validUrl) {
    // need to store produce short url
    // could check if url is already in our db. if so, aleady have shortUrl
    let shortUrl = await getShortUrl(urlToTest);
    if(shortUrl.newShort){
      await create(shortUrl.short, urlToTest);
    }
    
    response = {"original_url":urlToTest,"short_url":shortUrl.short}
  }
  else {
    response = {"error":"invalid URL"}
  }
 
  res.json(response);
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});