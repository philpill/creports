var express = require('express'),
    app = express(),
    q = require('q'),
    config = require('./config'),
    glob = require('glob'),
    fs = require('fs'),
    controllers = require('./controllers'),
    scrape = require('./scrape');

app.set('views', './views');
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/static'));
app.use(controllers)

app.listen(3000);

function clearLogs () {
    glob('logs/**/*.log', function (err, files) {
        if (!err) {
            files.forEach(function(file) {
                fs.unlink(file);
            });
        }
    });
}

function scrapeLoop () {
    clearLogs();
    setTimeout(function () {
        if (config.scraper && config.scraper.interval) {
            scrape();
            setTimeout(scrapeLoop, config.scraper.interval);
        }
    }, 1000);
}

scrapeLoop();