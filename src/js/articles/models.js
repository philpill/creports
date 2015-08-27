(function (document) {

    var Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min');


    var article = Backbone.Model.extend({
        defaults: {
            countries : [],
            headline : '',
            source : '',
            story : '',
            url : ''
        }
    });

    module.exports = {
        article : article
    };

})(document);