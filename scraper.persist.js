var q = require('q');

function persist (articles) {

  console.log('scraper.persist()');

  console.log(articles);


  return q();
}

module.exports = persist;
