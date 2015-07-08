var aylienApi = require('aylien_textapi');
var q = require('q');
var config = require('./config');

var id = config.aylien.id;
var key = config.aylien.key;
var api = new aylienApi({ application_id: id, application_key: key });

/*

[ { label: 'unrest, conflicts and war - crisis',
    code: '16011000',
    confidence: 1 } ]

[ { label: 'unrest, conflicts and war - riots',
    code: '16007000',
    confidence: 1 } ]


*/

function getClassification (story) {

    var deferred = q.defer();

    api.classify({

        text : story

    }, function(error, response) {

        if (error) {

            deferred.reject(error);

        } else {

            console.log(response.categories);

            deferred.resolve(response.categories);
        }
    });

    return deferred.promise;
}

function getLocations (story) {

    api.entities({

        text : story

    }, function(error, response) {

        if (error) {

            deferred.reject(error);

        } else {

            console.log(response.entities.location);

            deferred.resolve(response.entities.location);
        }
    });
}

function aylien (article) {

    console.log('scraper.analyse.aylien()');

    var deferred = q.defer();

    var story = article.data.story;

    q.spread([getClassification(story), getLocations(story)], function (classification, locations) {

        article.analysis.locations = locations;

        article.analysis.classification = classification;

        defer.resolve(article);

    }, function (error) {

        console.log(error);

        defer.reject();
    });

    return defer.promise;
}

module.exports = aylien;
