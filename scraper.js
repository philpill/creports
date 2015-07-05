var request = require('request');
var cheerio = require('cheerio');
var q = require('q');

function init () {

  console.log('scraper.init()');
}

function getFeed () {

  var deferred = q.defer();

  request('http://feeds.bbci.co.uk/news/world/rss.xml', function (error, response, html) {

    if (!error && response.statusCode === 200) {

      var promises = [];

      var $ = cheerio.load(html, {
        xmlMode: true
      });

      var $links = $('channel > item > link');

      var l = $links.length;

      for (var i = 0; i < l; i++) {

        promises[i] = getArticle($links.eq(i).text());
      }

      q.allSettled(promises).then(function (results) {

        processArticles(results);
 
        deferred.resolve();
      });
    }
  });

  return deferred.promise;
}

function processArticles (articles) {
 
  articles.forEach(function (article) {
                    
    if (article.state === "fulfilled") {
        
      console.log(article.value);
                    
    } else {
     
      console.log('error');                   
    }          
      
  });
}

function getArticle (url) {

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

function scrape () {

  console.log('scraper.scrape()');

  var deferred = q.defer();

  getFeed().then(function () {

    deferred.resolve();
  });

  return deferred.promise;
}



module.exports = {

  scrape : scrape
};
