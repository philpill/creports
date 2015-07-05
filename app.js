var express = require('express');
var app = express();
var q = require('q');
var scraper = require('./scraper');

app.set('views', './views');
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {

  // scraper.scrape()
  // .then(function () {

    res.render('index', { title: 'Hey' });
  
  // });

});

app.listen(3000);