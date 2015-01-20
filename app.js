var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.render('index', { title: 'Hey', message: 'Hello Grid!'});
});

app.listen(3000);
