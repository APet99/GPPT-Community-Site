var express = require('express');
const User = require("../models/user");
const Tournament = require('../models/tournament');
var router = express.Router();
const points = [8, 7, 6, 5, 4, 3, 2, 1, 0];


router.get('/getAllTournaments', async (req, res) => {
    const tournaments = await Tournament.find();
    res.send(tournaments);
});

router.get('/getCurrentTournament', async (req, res) => {
    const tournament = await Tournament.find().sort({createdAt: -1}).limit(1);
    res.send(tournament);
});


router.post('/createTournamentFromName/:name', async (req, res, next) =>{
    let requestBody = req.params.name;

    let query = { name:requestBody.name};
    let update = {name:requestBody.name};
    let options = {upsert: true, new: true, setDefaultsOnInsert: true};
    let tournament = await Tournament.findOneAndUpdate(query, update, options);

    res.status(200).send();
});

router.post('/createNewTournament', async (req, res, next) =>{
    let requestBody = req.body;

    let query = { name:requestBody.name};
    let update = {name:requestBody.name};
    let options = {upsert: true, new: true, setDefaultsOnInsert: true};
    let tournament = await Tournament.findOneAndUpdate(query, update, options);

    res.status(200).send();
});


router.route('/addPlayerToTournament/:id/:userName').put(async (req, res) =>{
    // console.log(req.params.id);
    // console.log(req.params.userName);
    var user = User({
        userName: req.params.userName
    });
    user.save();


    Tournament.updateOne(
        {_id: req.params.id},
        {$addToSet: {players: [user]}},
        async (err, result) =>{
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

router.route('/addPlayerToTournament').post(async (req, res) =>{
    let id = req.body._id;
    let userName = req.body.userName;

    let user = new User({
        userName: userName
    });
    user.save();


    Tournament.updateOne(
        {_id: id},
        {$addToSet: {players: [user]}},
        async (err, result) =>{
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

async function updateUserPos(tournamentID, userName, posFinish) {
    let user = await User.findOneAndUpdate({userName: userName}, {
        $inc: {
            tournamentScore: points[posFinish - 1],
            numberGamesPlayed: 1,
            numberFirstPlaceWins: (posFinish > 1? 0 : 1)
        },
    }, {new: true});
    return user;
}

async function removeUserFromTournament(tournamentID, userName){
    await Tournament.findOneAndUpdate(
        {_id: tournamentID},
        {$pull: {players: {userName: userName}}},
        {new: true}
    );
}

router.route('/recordPlayerInTournament/:id/:userName/:position').put(async (req, res) =>{
    let tournamentID = req.params.id;
    let userName = req.params.userName;
    let posFinish = parseInt(req.params.position);

    let user = await updateUserPos(tournamentID, userName, posFinish);
    await removeUserFromTournament(tournamentID, userName);

    await Tournament.findOneAndUpdate(
        {_id: tournamentID},
        {$addToSet: {players: [user]}},
        async (err, result) =>{
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

router.route('/recordPlayerInTournament').put(async (req, res) =>{
    let tournamentID = req.body.id;
    let userName = req.body.userName;
    let posFinish = parseInt(req.body.position);

    let user = await updateUserPos(tournamentID, userName, posFinish);
    await removeUserFromTournament(tournamentID, userName);

    await Tournament.findOneAndUpdate(
        {_id: tournamentID},
        {$addToSet: {players: [user]}},
        async (err, result) =>{
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

async function queryValidUser(userName, posFinish, list){
    if((userName != null && posFinish != null) && (userName != '' && posFinish != '')){
        list.push([userName, posFinish]);
    }
}


router.route('/massUpdateTournament').put(async (req, res) =>{
    let tournamentID = req.body.tournament_id;
    let users = [];

    await queryValidUser(req.body._id1, req.body.posFinish1, users);
    await queryValidUser(req.body._id2, req.body.posFinish2, users);
    await queryValidUser(req.body._id3, req.body.posFinish3, users);
    await queryValidUser(req.body._id4, req.body.posFinish4, users);
    await queryValidUser(req.body._id5, req.body.posFinish5, users);
    await queryValidUser(req.body._id6, req.body.posFinish6, users);
    await queryValidUser(req.body._id7, req.body.posFinish7, users);
    await queryValidUser(req.body._id8, req.body.posFinish8, users);

    // console.log(users);

    for (const u in users){
        let userName = users[u][0];
        let posFinish = parseInt(users[u][1]);

        let user = await updateUserPos(tournamentID, userName, posFinish);
        await removeUserFromTournament(tournamentID, userName);

        await Tournament.findOneAndUpdate(
            {_id: tournamentID},
            {$addToSet: {players: [user]}},
            async (err, result) =>{
                if (err) {
                    res.send(err);
                } else {
                    //do nothing
                }
            }
        );
    }
    res.send();
});



router.delete('/deleteTournament/:id', async (req, res) => {
    try {
        await Tournament.deleteOne({_id: req.params.id});
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({error: "Tournament Does Not Exist."});
    }
});

router.delete('/deleteTournamentByID', async (req, res) => {
    let data = req.body;

    try {
        await Tournament.deleteOne({_id: data._id});
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({error: "Tournament Does Not Exist."});
    }
});

router.delete('/deleteTournament', async (req, res) => {
    let data = req.body;

    try {
        await Tournament.deleteOne({name: data.name});
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({error: "Tournament Does Not Exist."});
    }
});

router.delete('/deleteAllTournaments/', async (req, res) => {
    await Tournament.remove({});
    res.status(200).send();

});


router.route('/removeUserFromTournament/:tournamentID/:userName').delete(async (req, res) =>{
    let tournamentID = req.params.tournamentID;
    let userName = req.params.userName;

    await removeUserFromTournament(tournamentID, userName);
});


router.route('/updateTournamentName/:currentName/:newName').put(async (req, res) =>{
    let currentName = req.params.currentName;
    let newName = req.params.newName;

    await Tournament.findOneAndUpdate(
        {name: currentName},
        {name: newName}, {new:true},
        async (err, result) =>{
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});



router.route('/getAllPlayersInTournament').get(async (req, res) =>{
    let tournamentID = req.body._id;

    await Tournament.findOne(
        {_id: tournamentID},
        {},
        async (err, result) =>{
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});


router.route('/getAllPlayersInTournament/:id').get(async (req, res) =>{
    let tournamentID = req.params.id;

    await Tournament.findOne(
        {_id: tournamentID},
        {},
        async (err, result) =>{
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

router.route('/getAllPlayersInTournamentDescending/:id').get(async (req, res) =>{
    let tournamentID = req.params.id;

    await Tournament.findOne(
        {_id: tournamentID},
        {},
        async (err, result) =>{
            if (result.players == null) {res.status(400).send();}
            else{
                let players = result.players;
                // console.log(players)


                players.sort((a, b) => (a.tournamentScore > b.tournamentScore) ? 1 : (a.tournamentScore === b.tournamentScore) ? ((a.tournamentScore > b.tournamentScore) ? 1 : -1) : -1 ).reverse();
                // console.log(players);

                res.send(players);
            }

        }
    );
});

//update player score


//update num games played

//update firstPlaceWins



module.exports = router;
