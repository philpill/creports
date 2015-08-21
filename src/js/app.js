(function (document, articles) {

    var $ = require('jquery.min');
    var _ = require('lodash.min');

    require('d3.min');
    require('topojson');
    require('datamaps.all.min');

    var map;

    var articlesByCountry = {};

    var countries = {};

    var geometries = Datamap.prototype.worldTopo.objects.world.geometries;

    var countryCodes = _.filter(_.map(geometries, getCountryCodeFromGeometryData), filterDisputedCountries);

    _.each(countryCodes, function (code) {
        countries[code] = 0;
    });

    console.log(countries);

    // countries which are disputed (e.g. Kosovo) have country codes of -99 which we cannot parse
    function filterDisputedCountries (id) {
        return id.match(/^[A-Z][A-Z][A-Z]$/);
    }

    function getCountryCodeFromGeometryData (geometry) {
        return geometry.id;
    }

    function init () {

        console.log('conflicting reports');

        console.log(articles);

        var $container = $('#Map');

        map = new Datamap({
            element : $container[0],
            responsive : true,
            projection: 'mercator',
            geographyConfig : {
                borderColor: 'Green',
                highlightFillColor : 'Green',
                highlightBorderWidth : 1,
                popupOnHover: false
            },
            fills : {
                defaultFill : 'black'
            },
            done: function(datamap) {

                datamap.svg.selectAll('.datamaps-subunit').on('click', onDatamapCountryClick);
            }
        });

        updateMap(articles);

        bindEvents();
    }

    function onDatamapCountryClick (geography) {

        console.log(geography);

        $('#Stories').removeClass('active');

        setTimeout(function () {

            var articles = articlesByCountry[geography.id];

            if (articles && articles.length > 0) {

                $('#Stories').addClass('active');

                document.getElementById('Articles').innerHTML = '';

                articles.forEach(function (article) {

                    document.getElementById('Country').innerHTML = geography.properties.name;

                    document.getElementById('Articles').innerHTML += '<li><a href="' + article.url + '">' + article.headline + '</a></li>';
                });
            }

        }, 600);
    }

    function bindEvents () {

        $(window).on('resize', map.resize.bind(map));

        $('.source-check').on('change', updateSources);
    }

    function updateSources () {

        var filteredArticles = [];

        var sources = $('.source-check:checked');

        _.each(articles, function (article) {

            _.each(sources, function (source) {

                if (source.value === article.source) {

                    filteredArticles.push(article);
                }
            });
        });

        clearData();
        updateMap(filteredArticles);
    }

    function clearData () {

        _.each(countryCodes, function (code) {

            countries[code] = 0;
        });

        articlesByCountry = {};
    }

    function updateMap (articles) {

        console.log('updateMap()');

        articles.forEach(function (article) {

            article.countries.forEach(function (country) {
                if (country.code) {
                    articlesByCountry[country.code] = articlesByCountry[country.code] || [];
                    articlesByCountry[country.code].push({
                        url : article.url,
                        headline : article.headline,
                        story : article.story
                    });
                    countries[country.code] = countries[country.code] ? countries[country.code] + 0.15 : 0.15;
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
