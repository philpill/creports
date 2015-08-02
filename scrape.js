var config = require('./config'),
    q = require('q'),
    Channel = require('./models/channel'),
    Article = require('./models/article'),
    mongojs = require('mongojs');

var db = mongojs('creports');

function scrape () {

    // console.log('scrape.scrape()');

    var articles = db.collection('articles');

    var channels = config.channels;

    var channel;

    channels.forEach(function (data) {

        if (!data.enabled) {

            return;
        }

        channel = new Channel(data.url, data.articleUrl, data.isXml, data.isUrlAttribute);

        channel.scrape().then(function processScrape (urls) {

            urls.forEach(function (url) {

                articles.findOne({ url : url }, function(err, article) {

                    if (err) {

                        console.log(err);

                    } else if (!article) {

                        var article = new Article(url, data);

                        article.scrape()
                        .then(article.format.bind(article))
                        .then(article.interpret.bind(article))
                        .then(function () {
                            console.log(article.url);
                            console.log(article.data.headline);
                            console.log('WAR:', article.isConflict ? '\033[31mtrue\033[0m' : 'false');

                            articles.insert(article);
                        });
                    } else {
                        console.log('scraped: ', url);
                    }
                });
            });
        });
    });
}

module.exports = scrape;