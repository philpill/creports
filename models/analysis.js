var q = require('q'),
    config = require('../config'),
    _ = require('lodash');

var keywords = _.map(config.keywords, function (keyword) {

    console.log(keyword);

    return keyword.term;
});

console.log(keywords);

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

function getCountries () {

    // console.log('getCountries()');

    var countries = [];

    var article = this;

    var story = this.data.story;

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

function getConflictRating () {

    // console.log('getConflictRating()');

    var article = this;

    var story = this.data.story;

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

module.exports = {
    getConflictRating : getConflictRating,
    getCountries : getCountries
};