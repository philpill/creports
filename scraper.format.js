var request = require('request');
var cheerio = require('cheerio');
var q = require('q');

function format (states) {

    console.log('scraper.format()');

    console.log(states.length);

    var articles = [];

    var l = states.length;

    var data;

    var article;

    for (var i = 0; i < l; i++) {

        data = states[i] && states[i].value ? states[i].value : null;

        if (data) {

            article = formatArticle(data);

            articles.push(article);
        }
    }

    return q(articles);
}

function Article (params) {

    this.url = params.url;
    this.data = {
        headline : params.headline,
        story : params.story
    };
    this.analysis = {
        categories : {},
        locations : {}
    };
}

function formatArticle (data) {

    console.log('formatArticle()');

    var article;

    var $ = cheerio.load(data.body);

    var $headline = $('.story-header, .story-body__h1, .article p.introduction');

    var $story = $('.story-body .story-body__inner p');

    if ($headline.length > 0) {

        // create proper article object here

        article = new Article({
            url : data.url,
            headline : $headline.text().trim(),
            story : $story.text().trim()
        });

        console.log(article);
    }

    return article;
}

module.exports = format;
