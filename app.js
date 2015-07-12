var express = require('express'),
    app = express(),
    q = require('q'),
    mongojs = require('mongojs');

var controllers = require('./controllers'),
    scrape = require('./scrape');

var day = 86400000;

app.set('views', './views');
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/static'));
app.use(controllers)

app.listen(3000);

scrape();