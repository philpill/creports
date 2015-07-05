var q = require('q');

function persist (articles) {

  console.log('scraper.persist()');

  console.log(articles.length);


  return q();
}

module.exports = persist;
