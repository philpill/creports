var request = require('request');
var cheerio = require('cheerio');
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

  request(url, function (error, response, html) {

    if (!error && response.statusCode === 200) {

        deferred.resolve(html);

    } else {

        deferred.reject();
    }
  });

  return deferred.promise;

}

function getArticleUrls (html) {

    console.log('getArticleUrls()');

  var $ = cheerio.load(html, {
    xmlMode: true
  });

  return q($('channel > item > link'));

}

function getArticles ($urls) {

    console.log('getArticles()');

    var deferred = q.defer();

    var promises = [];

    var l = $urls.length;

    for (var i = 0; i < l; i++) {

        promises[i] = getArticle($urls.eq(i).text());
    }

  q.allSettled(promises).then(function (articles) {

        deferred.resolve(articles);

    });

  return deferred.promise;

}

function getArticle (url) {
    console.log('getArticle()');

    console.log(url);

  var deferred = q.defer();

  request(url, function (error, response, html) {

    if (!error && response.statusCode === 200) {

      console.log(url);

      var $ = cheerio.load(html);

      var $headline = $('.story-header, .story-body__h1, .article p.introduction');

      if ($headline.length > 0) {

        $headline.filter(function(){

          var data = $(this);

          var title = data.text().trim();

          deferred.resolve(title);

        });

      } else {

        deferred.reject();
      }

    }
  });

  return deferred.promise;
}

module.exports = scrape;
