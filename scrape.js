var config = require('./config'),
    Channel = require('./models/channel'),
    Article = require('./models/article'),
    mongojs = require('mongojs');

var db = mongojs('creports');

function scrape () {

    // console.log('scrape.scrape()');

    var day = 86400000;

    var articles = db.collection('articles');

    var channels = config.channels;

    var channel = new Channel(channels[0].url, channels[0].articleUrl, channels[0].isXml);

    channel.scrape().then(function (urls) {

        urls.forEach(function (url) {

            var article = new Article(url, channels[0].article.headline, channels[0].article.story);

            article.scrape()
            .then(article.format.bind(article))
            .then(article.analyse.bind(article))
            .then(article.interpret.bind(article))
            .then(function () {
                console.log(article.url);
                console.log(article.data.headline);
                console.log(article.analysis.classifications);
                console.log('WAR:', article.isConflict);

                articles.insert(article);
            });
        });
    });

    setTimeout(function () {

        scrape();

    }, day);
}

module.exports = scrape;