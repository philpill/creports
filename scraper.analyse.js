var q = require('q');
var aylien = require('./scraper.analyse.aylien');

function analyse (articles) {

    console.log('scraper.analyse()');

    console.log(articles.length);

    var promises = [];

    articles.forEach(function (article) {

        promises.push(aylien(article));
    });

    return q.allSettled(promises);
}

module.exports = analyse;
