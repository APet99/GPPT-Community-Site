var express = require('express');
var router = express.Router();

var icon = 'images/grandpappy_logo_256x256.png';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Welcome To Grand Pappy's Poker!", icon: icon });
});

module.exports = router;
