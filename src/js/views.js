(function (document, articles) {

    var $ = require('jquery.min'),
        _ = require('lodash.min'),
        React = require('react.min'),
        Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min'),
        collections = require('./collections');

    require('d3.min');
    require('topojson');
    require('datamaps.all.min');

    var sourcesView = Marionette.CompositeView.extend({

        template : '#SourcesTemplate',

        onShow : function () {

            function updateSources () {

                console.log('updateSources()');

                var filteredArticles = [];

                var sources = $('.source-check:checked');

                _.each(articles, function (article) {

                    _.each(sources, function (source) {

                        if (source.value === article.source) {

                            filteredArticles.push(article);
                        }
                    });
                });

                Backbone.trigger('sources:updated', filteredArticles);
            }

            $('.source-check').on('change', updateSources);
        }
    });

    var articlesView = Marionette.CompositeView.extend({
        template: "#ArticlesTemplate"
    });

    var mapView = Marionette.LayoutView.extend({

        template: '#MapTemplate',

        initialize: function () {

            this.countries = this.countries || {};

            this.geometries = Datamap.prototype.worldTopo.objects.world.geometries;

            function getCountryCodeFromGeometryData (geometry) {
                return geometry.id;
            }

            // countries which are disputed (e.g. Kosovo) have country codes of -99 which we cannot parse
            function filterDisputedCountries (id) {
                return id.match(/^[A-Z][A-Z][A-Z]$/);
            }

            this.countryCodes = _.filter(_.map(this.geometries, getCountryCodeFromGeometryData), filterDisputedCountries);

            var that = this;

            _.each(that.countryCodes, function (code) {
                that.countries[code] = 0;
            });

            console.log(that.countries);

            this.listenTo(Backbone, 'sources:updated', function (articles) { that.clearData(); that.updateMap(articles); });
        },
        onRender: function () {

            console.log('main layout: onRender');

            var articleCollection = new collections.articles(articles);

            console.log(articleCollection);

            var that = this;

            $(window).on('resize', function () {

                that.map.resize();
            });
        },

        onShow: function () {

            console.log('main layout: onShow');

            var that = this;

            that.map = that.createMap($('#Map')[0]);

            this.updateMap(articles);
        },

        clearData : function () {

            var that = this;

            _.each(that.countryCodes, function (code) {

                that.countries[code] = 0;
            });

            that.articlesByCountry = {};
        },

        onDatamapCountryClick : function (geography) {

            console.log(geography);

            var that = this;

            $('#Stories').removeClass('active');

            setTimeout(function () {

                var articles = that.articlesByCountry[geography.id];

                if (articles && articles.length > 0) {

                    $('#Stories').addClass('active');

                    document.getElementById('Articles').innerHTML = '';

                    articles.forEach(function (article) {

                        document.getElementById('Country').innerHTML = geography.properties.name;

                        document.getElementById('Articles').innerHTML += '<li><a href="' + article.url + '">' + article.headline + '</a></li>';
                    });
                }

            }, 600);
        },

        createMap: function (container) {

            var that = this;

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

                    datamap.svg.selectAll('.datamaps-subunit').on('click', that.onDatamapCountryClick.bind(that));
                }
            };

            return new Datamap(options);
        },

        updateMap: function (articles) {

            console.log('updateMap()');

            var that = this;

            articles = articles || [];

            that.articlesByCountry = that.articlesByCountry || {};

            articles.forEach(function (article) {

                article.countries.forEach(function (country) {
                    if (country.code) {
                        that.articlesByCountry[country.code] = that.articlesByCountry[country.code] || [];
                        that.articlesByCountry[country.code].push({
                            url : article.url,
                            headline : article.headline,
                            story : article.story
                        });
                        that.countries[country.code] = that.countries[country.code] ? that.countries[country.code] + 0.15 : 0.15;
                    }
                });
            });

            Object.keys(that.countries).forEach(function(country, index) {

                var frequency = that.countries[country];

                var color = 'rgba(255, 0, 0, ' + frequency + ')';

                that.countries[country] = color;
            });

            console.log(that.countries);

            console.log(that.articlesByCountry);

            that.map.updateChoropleth(that.countries);
        }
    });

    module.exports = {

        map : mapView,
        articles : articlesView,
        sources : sourcesView
    };

})(document, articles);