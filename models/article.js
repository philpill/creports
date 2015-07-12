var request = require('request'),
    $ = cheerio = require('cheerio'),
    q = require('q'),
    config = require('../config'),
    analyse = require('./analysis.' + config.analyser.api);

var Article = function (url, headlineSelector, storySelector) {

    this.url = url;
    this.headlineSelector = headlineSelector;
    this.storySelector = storySelector;

    this.analysis = {
        location : [],
        classification : [],
        isWar : false
    };
    this.data = {};
}

Article.prototype.scrape = function () {

    console.log('scrape()');

    var dfd = q.defer();

    request(this.url, function (error, response, body) {

        var isOk = !error && response.statusCode === 200;

        body = isOk ? body : '';

        dfd.resolve(body);
    });

    return dfd.promise;
};

Article.prototype.format = function (body) {

    // console.log('formatArticle()');

    var article;

    var $ = cheerio.load(body);

    var $headline = $(this.headlineSelector).first();

    var $story = $(this.storySelector);

    // console.log($headline.text());

    if ($headline.length > 0) {

        this.data.headline = $headline.text().trim();

        this.data.story = $story.text().trim();
    }

    return q(article);
};

Article.prototype.analyse = analyse;

module.exports = Article;