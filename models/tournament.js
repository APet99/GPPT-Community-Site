const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("../models/user");

const tournamentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    players: []

}, {timestamps: true});

const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = Tournament;