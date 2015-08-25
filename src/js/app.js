(function (document, articles) {

    var $ = require('jquery.min'),
        _ = require('lodash.min'),
        React = require('react.min'),
        Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min'),
        views = require('./views');

    var app = new Marionette.Application();

    app.addRegions({
        appRegion: '#App'
    });

    // following example:
    // http://www.eccesignum.org/blog/simple-marionettejs-model-collection-and-collectionview-example
    app.module('App',function(module, App, Backbone, Marionette, $, _) {

        module.AppLayoutView = views.map;

        module.addInitializer(function() {

            console.log('conflicting reports');

            console.log(articles);

            app.appRegion.show(new views.map());
        });
    });

    $(document).ready(function() { app.start(); });

})(document, articles);
