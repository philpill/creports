var express = require('express'),
    app = express(),
    q = require('q'),
    controllers = require('./controllers'),
    config = require('./config'),
    Channel = require('./models/channel'),
    Article = require('./models/article');

var day = 86400000;

app.set('views', './views');
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/static'));
app.use(controllers)

app.listen(3000);


function scrape () {

    var channels = config.channels;

    var channel = new Channel(channels[0].url, channels[0].articleUrl, channels[0].isXml);

    channel.scrape().then(function (urls) {

        urls.forEach(function (url) {

            var article = new Article(url, channels[0].article.headline, channels[0].article.story);

            article.scrape()
            .then(article.format.bind(article))
            .then(article.analyse.bind(article))
            .then(function () {
                console.log(article.url);
                console.log(article.data.headline);
                console.log(article.analysis.classification);
                console.log('WAR:', article.analysis.isWar);
                console.log(article.analysis.locations);
            });
        });
    });

    setTimeout(function () {

        scrape();

    }, day);
}

scrape();





