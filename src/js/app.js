(function (document, articles) {

    var $ = require('jquery.min'),
        _ = require('lodash.min'),
        React = require('react.min'),
        Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min');

    require('d3.min');
    require('topojson');
    require('datamaps.all.min');

    var app = new Marionette.Application();

    app.addRegions({
        appRegion: '#App'
    });

    // following example:
    // http://www.eccesignum.org/blog/simple-marionettejs-model-collection-and-collectionview-example
    app.module('App',function(module, App, Backbone, Marionette, $, _) {

        module.AppLayoutView = Marionette.LayoutView.extend({

            template: '#MapTemplate',

            initialize: function() { console.log('main layout: initialize'); },
            onRender: function() { console.log('main layout: onRender'); },

            onShow: function() {

                console.log('main layout: onShow');

                var map, geometries,
                    countryCodes, articlesByCountry,
                    countries;

                function initialiseData () {

                    countries = countries || {};

                    geometries = Datamap.prototype.worldTopo.objects.world.geometries;

                    countryCodes = _.filter(_.map(geometries, getCountryCodeFromGeometryData), filterDisputedCountries);

                    _.each(countryCodes, function (code) {
                        countries[code] = 0;
                    });

                    console.log(countries);
                }

                function createMap (container) {

                    var options = {
                        element : container,
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
                    };

                    return new Datamap(options);
                }

                // countries which are disputed (e.g. Kosovo) have country codes of -99 which we cannot parse
                function filterDisputedCountries (id) {
                    return id.match(/^[A-Z][A-Z][A-Z]$/);
                }

                function getCountryCodeFromGeometryData (geometry) {
                    return geometry.id;
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

                    articlesByCountry = articlesByCountry || {};

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

                initialiseData();

                map = createMap($('#Map')[0]);

                updateMap(articles);

                bindEvents();
            }
        });

        module.addInitializer(function() {

            console.log('conflicting reports');

            console.log(articles);

            var layout = new module.AppLayoutView();

            app.appRegion.show(layout);
        });
    });

    $(document).ready(function() { app.start(); });

})(document, articles);
