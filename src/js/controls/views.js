(function (document, articles) {

    var $ = require('jquery.min'),
        _ = require('lodash.min'),
        Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min');

    var view = Marionette.CompositeView.extend({

        template : '#ControlsTemplate',

        events : {
            'change .source-check': 'updateSources'
        },

        updateSources : function () {

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
        },

        onRender: function () {

            var that = this;

            $(window).on('resize', function () {

                that.map.resize();
            });
        },

        onShow: function () {

            console.log('onRender()');

            var $cell = $('.intensity');

            var intensity = $cell.data('intensity');

            $cell.html('<span style="background-color: rgba(255,0,0,' + intensity +')"></span>' + (intensity*100).toFixed(2) + '%');

            this.map = this.createMap($('#Nav')[0]);
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
                }
            };

            return new Datamap(options);
        },
    });

    module.exports = view;

})(document, articles);
