var express = require('express'),
    router = express.Router(),
    mongojs = require('mongojs');

var db = mongojs('creports');

var articles = db.collection('articles');

router.get('/', function(req, res) {

    articles.find(function(err, docs) {

        res.render('index', { articles : JSON.stringify(docs) });
    });

});

module.exports = router;