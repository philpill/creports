(function (document, articles) {

    var $ = require('jquery.min'),
        _ = require('lodash'),
        Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min'),
        map = require('./map/views'),
        article = require('./articles/views'),
        controls = require('./controls/views'),
        models = require('./map/models');

    var app = new Marionette.Application();

    app.addRegions({
        mapRegion: '.region-map',
        articlesRegion: '.region-articles',
        controlsRegion: '.region-controls'
    });

    // following example:
    // http://www.eccesignum.org/blog/simple-marionettejs-model-collection-and-collectionview-example
    app.module('App',function(module, App, Backbone, Marionette, $, _) {

        module.AppLayoutView = map;

        module.addInitializer(function() {

            console.log('conflicting reports');

            console.log(articles);

            var mapModel = new models.map();

            app.mapRegion.show(new map({ model : mapModel }));

            app.articlesRegion.show(new article());

            app.controlsRegion.show(new controls({ model : mapModel }));
        });
    });

    $(document).ready(function() { app.start(); });

})(document, articles);
