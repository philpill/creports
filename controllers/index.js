var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {

    res.render('index', { title: 'Conflicting Reports' });
});

module.exports = router;