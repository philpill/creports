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

function aylien (article) {

    console.log('scraper.analyse.aylien()');

    var deferred = q.defer();

    api.classify({

        text : article.data.story

    }, function(error, response) {

        if (error) {

            deferred.reject(error);

        } else {

            console.log(response.categories);

            article.categories = response.categories;

            deferred.resolve(article);
        }
    });

    return deferred.promise;
}

module.exports = aylien;
