var express = require('express');
var router = express.Router();

var icon = 'images/grandpappy_logo_256x256.png';


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('waynecasino', { title: "Wayne Casino- Under Construction. Awaiting Client Information", icon: icon });
});

module.exports = router;
