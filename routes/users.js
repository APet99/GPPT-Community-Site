var express = require('express');
const User = require("../models/user");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/addUser', function (req,res, next){
  const user = new User({
    userName: 'user2',
    password: 'password'
  });
  user.save()
      .then((result) => {

        res.send(result);
        res.status(200);
      })
      .catch((err) => {
        console.log(err);
      });
});

router.get('/getUser/:userName', async (req, res) => {
    const user = await User.find({userName: req.params.userName});
    res.send(user);
});


router.delete('/deleteAllUsers', async (req, res) => {
    await User.remove({});
    res.status(200).send();
});


router.delete('/deleteUserByID/:id', async (req, res) => {
    try {
        await User.deleteOne({_id: req.params.id});
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({error: "User Does Not Exist."});
    }
});

router.delete('/deleteUserName/:userName', async (req, res) => {
    try {
        await User.deleteOne({userName: req.params.userName});
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({error: "User Does Not Exist."});
    }
});

router.route('/createUser').post(async (req, res)=> {
    let requestBody = req.body;

    let query = { userName:requestBody.userName};
    let update = {userName:requestBody.userName};
    let options = {upsert: true, new: true, setDefaultsOnInsert: true};
    let user = await User.findOneAndUpdate(query, update, options);

    res.status(200).send();
});


module.exports = router;
