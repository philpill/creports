(function (document, articles) {

    var $ = require('jquery.min');
    var _ = require('lodash.min');

    require('d3.min');
    require('topojson');
    require('datamaps.all.min');

    var map;

    var articlesByCountry = {};

    function init () {

        console.log('conflicting reports');

        console.log(articles);

        var $container = $('#Map');

        map = new Datamap({
            element : $container[0],
            responsive : true,
            projection: 'mercator',
            geographyConfig : {
                borderColor: 'LimeGreen',
                highlightFillColor : 'Green',
                highlightBorderColor : 'black',
                highlightBorderWidth : 1
            },
            fills : {
                defaultFill : 'black'
            },
            done: function(datamap) {
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    // console.log(geography.id);

                    var articles = articlesByCountry[geography.id];

                    if (articles && articles.length > 0) {

                        document.getElementById('Articles').innerHTML = '';

                        articles.forEach(function (article) {

                            document.getElementById('Articles').innerHTML += '<li><a href="' + article.url + '">' + article.headline + '</a></li>';
                        });
                    }
                });
            }
        });

        updateMap(articles);

        $(window).on('resize', function () {
            map.resize();
        });
    }

    function updateMap (articles) {

        // console.log('updateMap()');

        var countries = {};

        articles.forEach(function (article) {

            article.countries.forEach(function (country) {
                if (country.code) {
                    articlesByCountry[country.code] = articlesByCountry[country.code] || [];
                    articlesByCountry[country.code].push({
                        url : article.url,
                        headline : article.headline,
                        story : article.story
                    });
                    countries[country.code] = countries[country.code] ? countries[country.code] + 0.2 : 0.2;
                }
            });
        });

        Object.keys(countries).forEach(function(country, index) {

            var frequency = countries[country];

            var color = 'rgba(255, 0, 0, ' + frequency + ')';

            countries[country] = color;
        });

        console.log(countries);

        console.log(articlesByCountry);

        map.updateChoropleth(countries);
    }

  init();

})(document, articles);
