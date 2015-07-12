var aylienApi = require('aylien_textapi'),
    q = require('q'),
    config = require('../config');

var id = config.analyser.id;
var key = config.analyser.key;
var api = new aylienApi({ application_id: id, application_key: key });

/*

[ { label: 'unrest, conflicts and war - crisis',
    code: '16011000',
    confidence: 1 } ]

[ { label: 'unrest, conflicts and war - riots',
    code: '16007000',
    confidence: 1 } ]

[ { label: 'unrest, conflicts and war - act of terror',
    code: '16001000',
    confidence: 1 } ]

[ { label: 'guerrilla activity - bombings',
    code: '16005002',
    confidence: 1 } ]

[ { label: 'unrest, conflicts and war - massacre',
    code: '16006000',
    confidence: 1 } ]

*/

function getClassifications (story) {

    // console.log('analysis.aylien.getClassifications()');

    var dfd = q.defer();

    api.classify({

        text : story

    }, function(error, response) {

        if (error) {

            dfd.reject(error);

        } else {

            // console.log(response.categories);

            dfd.resolve(response.categories);
        }
    });

    return dfd.promise;
}

function getLocations (story) {

    // console.log('analysis.aylien.getLocations()');

    var dfd = q.defer();

    if (!story) {

        dfd.resolve();
    }

    api.entities({

        text : story

    }, function(error, response) {

        if (error) {

            console.log('error ', error);

            dfd.reject(error);

        } else {

            // console.log(response.entities.location);

            dfd.resolve(response.entities.location);
        }
    });

    return dfd.promise;
}

function analyse () {

    // console.log('analysis.aylien.analyse()');

    var dfd = q.defer();

    var article = this;

    var story = this.data.story;

    q.spread([getClassifications(story), getLocations(story)], function (classifications, locations) {

        article.analysis.locations = locations;

        article.analysis.classifications = classifications;

        dfd.resolve(article);

    }, function (error) {

        console.log('error ', error);

        console.log('url ', article.url);

        dfd.reject(error);
    });

    return dfd.promise;
}

module.exports = analyse;
