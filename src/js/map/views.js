(function (document, articles) {

    var $ = require('jquery.min'),
        _ = require('lodash'),
        Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min'),
        models = require('./models'),
        articlesCollection = require('../articles/collections');

    require('d3.min');
    require('topojson');
    require('datamaps.all.min');

    var view = Marionette.LayoutView.extend({

        template: '#MapTemplate',

        className : 'mapContainer',

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

            this.model.on('change:x change:y change:zoom', this.onModelChange, this);
        },

        onModelChange : function (e) {

            this.resizeMap();

            this.repositionMap();
        },

        resizeMap : function () {

            console.log('resizeMap()');

            var height = this.model.get('height'),
                width = this.model.get('width');

            this.$container.height(height);
            this.$container.width(width);

            console.log('height ', height);
            console.log('width ', width);

            this.map.resize();
        },

        repositionMap : function () {

            var height = this.model.get('height'),
                width = this.model.get('width');

            var x = this.model.get('x'),
                y = this.model.get('y');

            var containerHeight = this.$container.height(),
                containerWidth = this.$container.width();

            var marginTop = (y/100)*containerHeight,
                marginLeft = (x/100)*containerWidth;

            var maxLeft = width - this.model.get('originalWidth'),
                maxTop = height - this.model.get('originalHeight');


            // console.log('containerWidth ', containerWidth);
            // console.log('containerHeight ', containerHeight);

            // console.log('width ', width);
            // console.log('height ', height);

            // console.log('maxLeft ', maxLeft);
            // console.log('maxTop ', maxTop);
            // console.log('marginLeft ', marginLeft);
            // console.log('marginTop ', marginTop);

            marginLeft = marginLeft < maxLeft ? marginLeft : maxLeft;
            marginTop = marginTop < maxTop ? marginTop : maxTop;


            this.$el.css({
                'margin-top' : -marginTop,
                'margin-left' : -marginLeft
            });

        },

        onRender: function () {

            var articleCollection = new articlesCollection.articles(articles);

            var that = this;

            $(window).on('resize', function () {

                that.map.resize();
            });
        },

        onShow: function () {

            this.$container = $('.mapContainer');

            this.map = this.createMap($('#Map')[0]);

            this.updateMap(articles);
        },

        setModelDimensions : function () {

            console.log('setModelDimensions()');

            var height = this.$container.outerHeight(),
                width = this.$container.outerWidth();

            console.log('height ', height);
            console.log('width ', width);

            this.model.set({
                originalWidth : width,
                originalHeight : height,
                height : height,
                width : width
            });
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

            var country = new models.country({
                name : geography.properties.name,
                code : geography.id
            });

            var articles = new articlesCollection.articles(that.articlesByCountry[geography.id]);

            Backbone.trigger('countries:selected', articles, country);
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

                    that.setModelDimensions();
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

    module.exports = view;

})(document, articles);