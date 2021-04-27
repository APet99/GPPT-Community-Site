const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const User = require('./models/user.js');

module.exports.icon = 'images/grandpappy_logo_256x256.png';


const dbURI = "mongodb+srv://Alex:Password123@cluster0.sixvg.mongodb.net/GrandPappy?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => app.listen(3001, (req, res) => console.log('Connected to port 3000')))
    .then(err => console.log(err));


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const leaderboardRouter = require('./routes/leaderboards');
const membershipRouter = require('./routes/membership');
const signupRouter = require('./routes/signup');
const scheduleRouter = require('./routes/schedule');
const gpptRouter = require('./routes/gppt');
const wayneCasinoRouter = require('./routes/waynecasino');
const proTournamentRouter = require('./routes/protournament');
const tournamentRouter = require('./routes/tournaments');
const adminRouter = require('./routes/admin');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/leaderboards', leaderboardRouter);
app.use('/membership', membershipRouter);
app.use('/signup', signupRouter);
app.use('/schedule', scheduleRouter);
app.use('/gppt', gpptRouter);
app.use('/waynecasino', wayneCasinoRouter);
app.use('/protournament', proTournamentRouter);
app.use('/tournaments', tournamentRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});






module.exports = app;
mongoose.set('useFindAndModify', false);