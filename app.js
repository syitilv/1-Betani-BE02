var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var cors = require('cors');
const passport = require("passport");
const bodyParser = require('body-parser');
//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoute');
var farmerRouter = require('./routes/farmerRoute');
var buyersRouter = require('./routes/buyersRoute');
var cropRouter = require('./routes/cropRoute');
var weatherRouter = require('./routes/weather');  // api openweathermap
var recipeRouter = require('./routes/recipes'); // api resep makanan
var ongkirRouter = require('./routes/ongkirRoute');

var app = express();

// local database
// var url = 'mongodb://localhost:27017/db_betani';
// mongoose.connect(url);

//live database
var url = 'mongodb+srv://admin:adminbetani@cluster0.su99b.mongodb.net/db_betani?retryWrites=true&w=majority';
mongoose.connect(url);

//access
// app.all('*', function(req, res, next) {
//   var origin = req.get('origin'); 
//   res.header('Access-Control-Allow-Origin', origin);
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//MIDDLEWARES
require("./middlewares/passport")(passport);

//API
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/cuaca', weatherRouter); // api cuaca (per kota)
app.use('/cari-resep', recipeRouter); // api resep makanan

app.use('/petani', farmerRouter);
app.use('/petani/:farmerId', farmerRouter);
app.use('/pembeli', buyersRouter);
app.use('/pembeli/:buyerId', buyersRouter); 
app.use('/hasil_tani', cropRouter);
app.use('/ongkir', ongkirRouter);

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

// const port = process.env.PORT || 3000;
// app.listen(port);

module.exports = app;
