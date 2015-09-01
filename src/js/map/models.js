(function (document) {

    var Backbone = require('backbone-min');

    var country = Backbone.Model.extend({
        defaults : {
            name : '',
            code : ''
        }
    });

    var map = Backbone.Model.extend({
        defaults : {
            zoom : 0,
            x : 0,
            y : 0,
            originalHeight : 0,
            originalWidth : 0,
            height : 0,
            width : 0
        },
        incrementZoom : function (zoom) {

            console.log('setZoom()');

            console.log(zoom);

            var newZoom = this.get('zoom') + zoom;

            newZoom = newZoom < 0 ? 0 : newZoom;
            newZoom = newZoom > 10 ? 10 : newZoom;

            this.set({
                zoom : newZoom
            });
        }
    });

    module.exports = {

        country : country,
        map : map
    };

})(document);