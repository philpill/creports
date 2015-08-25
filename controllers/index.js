var express = require('express'),
    router = express.Router(),
    mongojs = require('mongojs'),
    _ = require('lodash'),
    config = require('../config'),
    pjson = require('../package.json');

var db = mongojs('creports');

var articles = db.collection('articles');

router.get('/', function(req, res) {

    var now = Date.now();

    var week = 604800000;

    var day = 86400000;

    var ageLimit = now - day - day - day;

    var criteria = {
        isConflict : true,
        created : { $gt : ageLimit },
        $where : 'this.countries.length > 0'
    };

    var projection = {
        cities : 1,
        countries : 1,
        data : 1,
        url : 1,
        source : 1,
        _id :0
    };

    articles.find(criteria, projection, function (err, docs) {

        var sources = [];

        var configChannels = [];

        docs.forEach(function (doc) {

            doc.headline = doc.data.headline;
            doc.story = doc.data.story;

            sources.push(doc.source);

            delete doc.data;

            return doc;
        });

        sources = _.uniq(sources);

        _.each(sources, function (source) {

            var configChannel = _.find(config.channels, function(channel) { return channel.name === source });

            if (configChannel) {
                configChannels.push({
                    name : configChannel.name,
                    domain : configChannel.domain,
                    id : configChannel.id
                });
            };
        });

        res.render('index', { articles : JSON.stringify(docs), sources : configChannels, version: pjson.version });
    });
});

module.exports = router;