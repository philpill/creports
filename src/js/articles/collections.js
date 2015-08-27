(function (document) {

    var Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min'),
        models = require('./models');

    var articles = Backbone.Collection.extend({

        model: models.article

    });

    module.exports = {
        articles : articles
    };

})(document);