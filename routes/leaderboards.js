var express = require('express');
var router = express.Router();

var icon = 'images/grandpappy_logo.png';

/* GET users listing. */

router.get('/', function(req, res, next) {
    res.render('leaderboards', { title: 'Leaderboard', icon: icon });
});

module.exports = router;
