var scrape = require('./article.scrape'),
    format = require('./article.format'),
    analyse = require('./article.analyse');

var Article = function () {

}

Article.prototype.scrape = scrape;

Article.prototype.format = format;

Article.prototype.analyse = analyse;

module.exports = Article;