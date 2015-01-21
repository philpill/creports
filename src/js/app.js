(function (document) {

    var $ = require('jquery.min');
    require('d3');
    require('topojson');
    require('datamaps.all');

    function init () {

        var map = new Datamap({element: document.getElementById('Container')});
    }

    init();

})(document);