(function (document) {

    var $ = require('jquery.min'),
        _ = require('lodash.min'),
        React = require('react.min'),
        Backbone = require('backbone-min'),
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

    var country = Backbone.Model.extend({
        defaults : {
            name : '',
            code : ''
        }
    });

    module.exports = {

        article : article,
        country : country
    };

})(document);