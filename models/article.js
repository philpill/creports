var request = require('request'),
    $ = cheerio = require('cheerio'),
    q = require('q'),
    _ = require('lodash'),
    config = require('../config'),
    countriesToCities = require('../vendor/CountriesToCitiesJSON/countriesToCities'),
    countryCodes = require('../countries');


var cities = loadCities(countriesToCities);

var countries = loadCountries(countriesToCities);

function loadCountries (countriesToCities) {

    console.log('loadCountries()');

    var countries = [];

    countries = countries.concat(Object.keys(countriesToCities));

    // console.log(countries.length);

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

var keywords = _.map(config.keywords, function (keyword) {

    // console.log(keyword);

    return keyword.term;
});

var keywordsRating = [];

_.each(config.keywords, function (keyword) {

    keywordsRating[keyword.term] = keyword.relevance
});

var countryNames = _.flatten(_.map(config.countries, function (country) {

    return country.names;
}));

var countriesByName = [];

_.each(config.countries, function (country) {

    _.each(country.names, function (name) {

        countriesByName[name] = country.code;
    });
});

var Article = function (url, data) {

    this.url = url;
    this.headlineSelector = data.article.headline;
    this.storySelector = data.article.story;
    this.isConflict = data.isConflictNews;
    this.countries = [];
    this.cities = [];

    this.data = {};
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

Article.prototype.getCountries = function () {

    // console.log('getCountries()');

    var countries = [];

    var article = this;

    var story = article.data.story;

    for (var i = 0, j = countryNames.length; i < j; i++) {

        if (new RegExp('\\b' + countryNames[i] + '\\b', 'g').test(story)) {

            var country = countryNames[i];

            var code = countriesByName[country];

            // console.log('CODE: ', code);

            countries.push({
                name : country,
                code : code
            });
        }
    }

    console.log(countries);

    return countries;
}

Article.prototype.getConflictRating = function () {

    // console.log('getConflictRating()');

    var article = this;

    var story = article.data.story;

    var lineBreaks = /\r?\n|\r/g;

    var punctuation = /[\.,-\/#!$%\^&\*;:{}=\-_`~()?'"]/g;

    story = story.replace(punctuation, ' ');

    story = story.replace(lineBreaks, ' ');

    // console.log(story);

    var points = 0;

    var keyword;

    var matches;

    var rating;

    var occurances = 0;

    for (var i = 0, j = keywords.length; i < j; i++) {

        keyword = keywords[i];

        rating = keywordsRating[keyword];

        matches = story.match(new RegExp('\\b' + keyword + '\\b', 'gi')) || [];

        // limit repetitions
        occurances = matches.length > 5 ? 5 : matches.length;

        // console.log('keywordsRating[keyword] ', keyword);

        if (occurances) {
            console.log(keyword);
        }

        // console.log('story.match(new RegExp(keyword, gi)).length', matches.length);


        points += (rating * occurances);
    }

    // console.log('POINTS ', points);
    // console.log('KEYWORDS', keywords.length);

    // console.log(points && keywords.length ? points/keywords.length : 0);

    return points && keywords.length ? points/keywords.length : 0;
}

module.exports = Article;


