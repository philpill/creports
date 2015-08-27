(function (document, articles) {

    var $ = require('jquery.min'),
        _ = require('lodash.min'),
        React = require('react.min'),
        Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min'),
        map = require('./map/views'),
        article = require('./articles/views'),
        sources = require('./sources/views');

    var app = new Marionette.Application();

    app.addRegions({
        appRegion: '#App',
        articlesRegion: '#Articles',
        sourcesRegion: '#Sources'
    });

    // following example:
    // http://www.eccesignum.org/blog/simple-marionettejs-model-collection-and-collectionview-example
    app.module('App',function(module, App, Backbone, Marionette, $, _) {

        module.AppLayoutView = map;

        module.addInitializer(function() {

            console.log('conflicting reports');

            console.log(articles);

            app.appRegion.show(new map());

            app.articlesRegion.show(new article());

            app.sourcesRegion.show(new sources());
        });
    });

    $(document).ready(function() { app.start(); });

})(document, articles);
