var express = require('express');
var app = express();
var q = require('q');

var scrape = require('./scraper.scrape');
var format = require('./scraper.format');
var persist = require('./scraper.persist');
var analyse = require('./scraper.analyse');

app.set('views', './views');
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {

  scrape()
  .then(format)
  .then(analyse)
  .then(persist)
  .then(function () {

    res.render('index', { title: 'Hey' });

  });

});

app.listen(3000);
