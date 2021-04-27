var express = require('express');
var router = express.Router();

var icon = 'images/grandpappy_logo_256x256.png';


/* GET home page. */
router.get('/', function(req, res) {
    res.render('schedule', { title: 'Hosting Schedule',
        message:'Schedule', icon:icon });
});

module.exports = router;
