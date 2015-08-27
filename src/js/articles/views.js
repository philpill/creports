(function () {

    var Backbone = require('backbone-min'),
        Marionette = require('backbone.marionette.min');

    var articleView = Marionette.ItemView.extend({

        tagName: "li",

        template: "#ArticleTemplate"
    });

    var articlesView = Marionette.CompositeView.extend({

        template : '#ArticlesTemplate',

        childView : articleView,

        childViewContainer : 'ul',

        initialize : function () {

            this.listenTo(Backbone, 'countries:selected', function (articles, country) {

                this.model = country;

                this.collection = articles;

                this.render();
            });
        }
    });

    module.exports = articlesView;

})();