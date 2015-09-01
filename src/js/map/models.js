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
        getModifier : function (zoom) {

            return 1 + 0.3 * zoom;
        },
        setZoom : function (newZoom) {

            console.log('setZoom()');

            var modifier = this.getModifier(newZoom),

            newHeight = this.get('originalHeight')*modifier,
            newWidth = this.get('originalWidth')*modifier;

            console.log('originalHeight ', this.get('originalHeight'));
            console.log('originalWidth ', this.get('originalWidth'));
            console.log('newHeight ', newHeight);
            console.log('newWidth ', newWidth);
            console.log('newZoom ', newZoom);

            this.set({
                height : newHeight,
                width : newWidth,
                zoom : newZoom
            });
        },
        incrementZoom : function (zoom) {

            console.log('setZoom()');

            var newZoom = this.get('zoom') + zoom;

            newZoom = newZoom < 0 ? 0 : newZoom;
            newZoom = newZoom > 10 ? 10 : newZoom;

            console.log(newZoom);

            this.setZoom(newZoom);
        }
    });

    module.exports = {

        country : country,
        map : map
    };

})(document);