var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var farmerRouter = require('./routes/farmerRoute');
var buyersRouter = require('./routes/buyersRoute');
var cropRouter = require('./routes/cropRoute'); // added

var app = express();

//database
var url = 'mongodb://localhost:27017/db_betani';
mongoose.connect(url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//API
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/petani', farmerRouter); // added

app.use('/petani', farmerRouter);

app.use('/buyers', buyersRouter);
app.use('/buyers/:buyerId', buyersRouter); 

app.use('/hasil_tani', cropRouter); // added

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
