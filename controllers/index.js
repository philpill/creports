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
        created : { $gt : ageLimit },
        $where : 'this.countries.length > 0'
    };

    var projection = {
        cities : 1,
        countries : 1,
        created : 1,
        data : 1,
        url : 1,
        _id :0
    };

    articles.find(criteria, projection, function(err, docs) {

        res.render('index', { articles : JSON.stringify(docs) });
    });

});

module.exports = router;