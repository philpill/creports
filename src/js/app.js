(function (document) {

  var $ = require('jquery.min');
  require('d3');
  require('topojson');
  require('datamaps.all');

  function init () {

    console.log('conflicting reports');

    var $container = $('#Map');

    var map = new Datamap({
        element : $container[0],
        responsive : true,
        projection: 'mercator',
        geographyConfig : {
            highlightOnHover : true,
            highlightFillColor : 'skyblue',
            highlightBorderColor : 'white',
            highlightBorderWidth : 1
        },
        fills : {
            defaultFill : 'gray'
        }
    });

    $(window).on('resize', function () {
      map.resize();
    });
  }

  init();

})(document);
