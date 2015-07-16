var express = require('express'),
    app = express(),
    q = require('q');

var controllers = require('./controllers'),
    scrape = require('./scrape');

app.set('views', './views');
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/static'));
app.use(controllers)

app.listen(3000);

// check database

// scrape();