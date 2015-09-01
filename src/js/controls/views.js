(function (document, articles) {

    var $ = require('jquery.min'),
        _ = require('lodash.min'),
        Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min');

    var view = Marionette.CompositeView.extend({

        template : '#ControlsTemplate',

        events : {
            'change .source-check' : 'updateSources',
            'click #Nav' : 'clickNav',
            'click .zoomButton' : 'clickZoomButton',
            'click .zoomLevel li' : 'clickZoomLevel'
        },

        clickZoomLevel : function (e) {

            var zoom = $(e.currentTarget).data('zoom');

            this.model.set({ zoom : zoom });
        },

        clickZoomButton : function (e) {

            var zoom = $(e.currentTarget).data('zoom-increment');

            this.model.incrementZoom(zoom);
        },

        clickNav : function (e) {

            console.log('clickNav()');

            var $currentTarget = $(e.currentTarget);

            var offsetX = e.offsetX;
            var offsetY = e.offsetY;

            var height = $currentTarget.outerHeight();
            var width = $currentTarget.outerWidth();

            var x = Math.round((offsetX/width)*100);
            var y = Math.round((offsetY/height)*100);

            // console.log($currentTarget);
            // console.log('offsetX ', offsetX);
            // console.log('offsetY ', offsetY);
            // console.log('height ', height);
            // console.log('width ', width);
            // console.log('positionX ', Math.round((offsetX/width)*100));
            // console.log('positionY ', Math.round((offsetY/height)*100));

            this.model.set({
                x : x,
                y : y
            });

            // Backbone.trigger('nav:click', { x : x, y : y });
        },

        onModelChange : function (e) {

            this.resizeViewfinder();

            this.repositionViewfinder();
        },

        resizeViewfinder : function () {

            var zoom = this.model.get('zoom'),
                modifier = Math.round((1/(1 + 0.3 * zoom)*100));

            $('.viewfinder').height(modifier + '%');
            $('.viewfinder').width(modifier + '%');
        },

        repositionViewfinder : function () {

            var $viewfinder = $('.viewfinder');

            var top = this.model.get('y'),
                left = this.model.get('x');

            var parent = $viewfinder.parent(),
                parentHeight = parent.innerHeight(),
                parentWidth = parent.innerWidth();

            var height = Math.round(100*($viewfinder.height()/parentHeight)),
                width = Math.round(100*($viewfinder.width()/parentWidth));

            var maxLeft = 100 - width,
                maxTop = 100 - height;

            $('.viewfinder').css({
                top : (top > maxTop ? maxTop : top) + '%',
                left : (left > maxLeft ? maxLeft : left) + '%'
            });

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
        },

        onRender: function () {

            var that = this;

            $(window).on('resize', function () {

                that.map.resize();
            });
        },

        onShow: function () {

            console.log('onRender()');

            var $cell = $('.intensity');

            var intensity = $cell.data('intensity');

            $cell.html('<span style="background-color: rgba(255,0,0,' + intensity +')"></span>' + (intensity*100).toFixed(2) + '%');

            this.map = this.createMap($('#Nav')[0]);

            this.model.on('change:x change:y change:zoom', this.onModelChange.bind(this));
        },

        createMap: function (container) {

            var options = {
                element : container,
                responsive : true,
                projection: 'mercator',
                geographyConfig : {
                    borderColor: 'Green',
                    highlightFillColor : 'Green',
                    highlightBorderWidth : 1,
                    popupOnHover: false
                },
                fills : {
                    defaultFill : 'black'
                }
            };

            return new Datamap(options);
        },
    });

    module.exports = view;

})(document, articles);
