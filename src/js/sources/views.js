(function (document, articles) {

    var $ = require('jquery.min'),
        _ = require('lodash.min'),
        Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min');

    var view = Marionette.CompositeView.extend({

        template : '#SourcesTemplate',

        el : 'ul',

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
        }
    });

    module.exports = view;

})(document, articles);
