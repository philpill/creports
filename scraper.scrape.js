var request = require('request');
var $ = cheerio = require('cheerio'); // seems a bit dumb, but required to load xml
var q = require('q');

function scrape () {

    var deferred = q.defer();

    console.log('scraper.scrape()');

    return getData('http://feeds.bbci.co.uk/news/world/rss.xml');
}

function getData (url) {

    return getFeed(url).then(getArticleUrls).then(getArticles);

}

function getFeed (url) {

  var deferred = q.defer();

  request(url, function (error, response, body) {

    if (!error && response.statusCode === 200) {

        deferred.resolve(body);

    } else {

        deferred.reject();
    }
  });

  return deferred.promise;
}

/**
 * Filter article URLs from HTML
 * @param {String} html HTML request response body
 * @return {Array.String} array of article URLs
 */
function getArticleUrls (html) {

    console.log('getArticleUrls()');

    var urls = [];
    var $$ = cheerio.load(html, { xmlMode: true });

    $$('channel > item > link').each(function (index, el) {
        urls.push($(el).text());
    });

    return urls;
}

/**
 * Get articles from list of URLs
 * @param {Array.String} urls list of article URLs
 * @return {Object} q.promise
 */
function getArticles (urls) {

    console.log('getArticles()');

    var promises = [];

    urls.forEach(function (url) {

        promises.push(getArticle(url));
    });

    return q.allSettled(promises);
}

/**
 * Get the HTML for the url provided
 * @param {String} url Article URL
 * @return {Object} q.promise
 */
function getArticle (url) {

    console.log('getArticle()');

    console.log(url);

    var deferred = q.defer();

    request(url, function (error, response, body) {

        var isOk = !error && response.statusCode === 200;

        body = isOk ? body : '';

        deferred.resolve(body);

    });

    return deferred.promise;
}

module.exports = scrape;
