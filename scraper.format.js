var request = require('request');
var cheerio = require('cheerio');
var q = require('q');

function format (states) {

    console.log('scraper.format()');

    console.log(states.length);

    var articles = [];

    var l = states.length;

    for (var i = 0; i < l; i++) {

        if (states[i].value) {

            articles.push(formatArticle(states[i].value));
        }
    }

    return q(articles);
}

function formatArticle (data) {

    console.log('formatArticle()');

    var article;

    var $ = cheerio.load(data);

    var $headline = $('.story-header, .story-body__h1, .article p.introduction');

    if ($headline.length > 0) {

        article = $headline.text().trim();

        console.log(article);
    }

    return article;
}



module.exports = format;
