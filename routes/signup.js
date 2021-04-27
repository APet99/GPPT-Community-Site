var express = require('express');
var router = express.Router();

var icon = 'images/grandpappy_logo.png';


/* GET home page. */
router.get('/', function(req, res) {
    res.render('signup', { title: 'Signup Page',
        message:'signupMessage', icon:icon });
});

module.exports = router;
