const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    tournamentScore:{
        type: Number,
        default: 0,
        required: false
    },
    numberGamesPlayed:{
        type: Number,
        default: 0,
        required: false
    },
    numberFirstPlaceWins:{
        type: Number,
        default: 0,
        required: false
    }

}, {timestamps: true});

const User = mongoose.model('User', userSchema);
module.exports = User;