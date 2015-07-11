var express = require('express'),
    router = express.Router(),
    Article = require('../models/article');

router.get('/', function(req, res) {

    var article = new Article();

    article.scrape()
      .then(article.format)
      .then(article.analyse)
      .then(function () {
        res.render('index', { title: 'Conflicting Reports' });
      });

});

module.exports = router;