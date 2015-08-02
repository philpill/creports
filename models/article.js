var request = require('request'),
    $ = cheerio = require('cheerio'),
    q = require('q'),
    config = require('../config'),
    analysis = require('./analysis'),
    countriesToCities = require('../vendor/CountriesToCitiesJSON/countriesToCities'),
    countryCodes = require('../countries');


var cities = loadCities(countriesToCities);

var countries = loadCountries(countriesToCities);

function loadCountries (countriesToCities) {

    console.log('loadCountries()');

    var countries = [];

    countries = countries.concat(Object.keys(countriesToCities));

    console.log(countries.length);

    return countries;
}

function loadCities (countriesToCities) {

    // console.log('loadCities()');

    var cities = [];

    Object.keys(countriesToCities).forEach(function (country) {
        if (countriesToCities[country].length) {
            cities = cities.concat(countriesToCities[country]);
        }
    });

    return cities;
}

var Article = function (url, data) {

    this.url = url;
    this.headlineSelector = data.article.headline;
    this.storySelector = data.article.story;
    this.isConflict = data.isConflictNews;
    this.countries = [];
    this.cities = [];

    this.analysis = {
        locations : [],
        classifications : []
    };
    this.data = {};
    this.inaccuracy = 0.01;
    this.created = Date.now();

    this.source = {
        domain : data.domain,
        name : data.name
    };
}

Article.prototype.scrape = function () {

    console.log('scrape()');

    console.log(this.url);

    var dfd = q.defer();

    request(this.url, function (error, response, body) {

        var isOk = !error && response.statusCode === 200;

        body = isOk ? body : '';

        dfd.resolve(body);
    });

    return dfd.promise;
};

Article.prototype.format = function (body) {

    // console.log('format()');

    var $ = cheerio.load(body);

    var $headline = $(this.headlineSelector).first();

    var $story = $(this.storySelector);

    if ($headline.length > 0 && $story.length > 0) {

        this.data.headline = $headline.text().trim();

        this.data.story = $story.text().trim();
    }

    return q();
};

Article.prototype.interpret = function () {

    console.log('interpret()');

    var article = this;

    article.countries = article.getCountries();

    if (!article.isConflict) {

        var conflictRating = article.getConflictRating();

        // http://misc.flogisoft.com/bash/tip_colors_and_formatting#foreground_text
        console.log('CONFLICT RATING: \033[31m', conflictRating, '\033[0m');

        article.isConflict = conflictRating > 0.7;
    }

    return q();

};

Article.prototype.getConflictRating = analysis.getConflictRating;

Article.prototype.getCountries = analysis.getCountries;

module.exports = Article;


