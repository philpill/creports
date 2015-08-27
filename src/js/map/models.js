(function (document) {

    var Backbone = require('backbone-min');

    var country = Backbone.Model.extend({
        defaults : {
            name : '',
            code : ''
        }
    });

    module.exports = {

        country : country
    };

})(document);