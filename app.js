var express = require('express');
var app = express();
var q = require('q');
var controllers = require('./controllers');

app.set('views', './views');
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/static'));
app.use(controllers)

app.listen(3000);
