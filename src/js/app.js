(function (document, articles) {

    var $ = require('jquery.min');
    require('d3');
    require('topojson');
    require('datamaps.all');

    var map;

    function init () {

        console.log('conflicting reports');

        console.log(articles);

        var $container = $('#Map');

        map = new Datamap({
            element : $container[0],
            responsive : true,
            projection: 'mercator',
            geographyConfig : {
                highlightOnHover : true,
                highlightFillColor : 'skyblue',
                highlightBorderColor : 'white',
                highlightBorderWidth : 1
            },
            fills : {
                defaultFill : 'gray'
            },
            done: function(datamap) {
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    console.log(geography.id);
                });
            }
        });

        updateMap(articles);

        $(window).on('resize', function () {
            map.resize();
        });
    }

    function updateMap (articles) {

        console.log('updateMap()');

        var countries = {};

        articles.forEach(function (article) {

            article.countries.forEach(function (country) {
                if (country.code) {
                    countries[country.code] = 'red';
                }
            });
        });

        console.log(countries);

        map.updateChoropleth(countries);
    }

  init();

})(document, articles);
