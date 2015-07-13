var express = require('express'),
    router = express.Router(),
    mongojs = require('mongojs');

var db = mongojs('creports');

var articles = db.collection('articles');

router.get('/about', function(req, res) {
  res.send('About birds');
});



router.get('/', function(req, res) {

    articles.find(function(err, docs) {

        res.render('index', { title: 'Conflicting Reports', articles : JSON.stringify(docs) });
    });

});

module.exports = router;