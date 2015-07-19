var express = require('express'),
    router = express.Router(),
    mongojs = require('mongojs');

var db = mongojs('creports');

var articles = db.collection('articles');

router.get('/', function(req, res) {

    var now = Date.now();

    var week = 604800000;

    var day = 86400000;

    var ageLimit = now - day - day - day;

    var criteria = {
        isConflict : true,
        created : { $gt : ageLimit }
    };

    articles.find({ isConflict : true }, function(err, docs) {

        res.render('index', { articles : JSON.stringify(docs) });
    });

});

module.exports = router;