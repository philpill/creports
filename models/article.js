var request = require('request'),
    $ = cheerio = require('cheerio'),
    q = require('q'),
    config = require('../config'),
    analyse = require('./analysis.' + config.analyser.api),
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

var Article = function (url, headlineSelector, storySelector, isConflict) {

    this.url = url;
    this.headlineSelector = headlineSelector;
    this.storySelector = storySelector;
    this.isConflict = isConflict;
    this.countries = [];
    this.cities = [];

    this.analysis = {
        locations : [],
        classifications : []
    };
    this.data = {};
    this.inaccuracy = 0.01;
    this.created = Date.now();
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

    // console.log($headline.text());

    if ($headline.length > 0) {

        this.data.headline = $headline.text().trim();

        this.data.story = $story.text().trim();
    }

    return q();
};

Article.prototype.interpret = function () {

    // console.log('interpret()');

    var article = this;

    // http://cv.iptc.org/newscodes/subjectcode/16000000
    function isConflict (classifications) {

        article.inaccuracy += config.analyser.imprecision.classification;

        var isConflict = false;
        var regex = /^160[0-9]*/;
        classifications.forEach(function (classification) {
            if (regex.test(classification.code)) {
                isConflict = true;
                return false;
            }
        });
        return isConflict;
    }

    function processLocations () {

        console.log('processLocations()');

        var locations = article.analysis.locations || [];

        for (var i = 0, j = locations.length; i < j; i++) {

            console.log(locations[i]);

            if (isCountry(locations[i])) {

                console.log('country ', locations[i]);

                article.countries.push({
                    name : locations[i],
                    code : getCountryCode(locations[i])
                });

            } else if (isCity(locations[i])) {

                console.log('city ', locations[i]);

                article.cities.push(locations[i]);

            }
        }
    }

    function isCountry (location) {

        // console.log('isCountry()');

        article.inaccuracy += config.analyser.imprecision.country;

        return (countries.indexOf(location) != -1);
    }

    function getCountryCode (country) {
        // console.log('getCountryCode() ', country);
        var code = '';
        for (var i = 0, j = countryCodes.length; i < j; i++) {
            if (country.toLowerCase() === countryCodes[i].name.toLowerCase()) {
                code = countryCodes[i].code;
                break;
            }
        }
        console.log(code);
        return code;
    }

    function isCity (location) {

        // console.log('isCity()');

        // console.log(location);

        article.inaccuracy += config.analyser.imprecision.city;

        return (cities.indexOf(location) != -1);
    }

    if (!article.isConflict) {

        article.isConflict = isConflict(article.analysis.classifications);
    }

    processLocations();

    return q();

};

Article.prototype.analyse = analyse;

module.exports = Article;


