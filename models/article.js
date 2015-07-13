var request = require('request'),
    $ = cheerio = require('cheerio'),
    q = require('q'),
    config = require('../config'),
    analyse = require('./analysis.' + config.analyser.api),
    countries = require('../vendor/CountriesToCitiesJSON/countriesToCities');

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
}

Article.prototype.scrape = function () {

    // console.log('scrape()');

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

    function getCountries () {

        // console.log('getCountries()');


        article.analysis.locations.forEach(function (location) {
            Object.keys(countries).forEach(function (country) {
                if (location.toLowerCase() === country.toLowerCase()) {

                    console.log('country ', country);

                    article.inaccuracy += config.analyser.imprecision.country;

                    article.countries.push(country);

                    return false;
                }
            });
        });
    }

    function getCities () {

        // console.log('getCities()');

        article.analysis.locations.forEach(function (location) {

            article.countries.forEach(function (country) {

                countries[country].forEach(function (city) {

                    // console.log('test country ' + country + ', city ' + city);

                    if (location.toLowerCase() === city.toLowerCase()) {

                        console.log('city ' + city + ', ' + country);

                        article.inaccuracy += config.analyser.imprecision.city;

                        article.cities.push(city);

                        return false;
                    }
                });
            });
        });
    }

    if (!article.isConflict) {

        article.isConflict = isConflict(article.analysis.classifications);
    }


    getCountries();

    getCities();

    return q();

};

Article.prototype.analyse = analyse;

module.exports = Article;


