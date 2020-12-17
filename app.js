var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose'); // added
const bcrypt = require('bcrypt'); // register
const jwt = require('jsonwebtoken'); // register

var dotenv = require('dotenv').config();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var farmerRouter = require('./routes/farmerRoute'); // farmer
var weatherRouter = require('./routes/weather');  // api bmkg
var farmerRouter = require('./routes/farmerRoute');
var buyersRouter = require('./routes/buyersRoute');
var cropRouter = require('./routes/cropRoute'); // added

var app = express();

// local database
// var url = 'mongodb://localhost:27017/db_betani';
// mongoose.connect(url);

//live database
var url = 'mongodb+srv://admin:adminbetani@cluster0.su99b.mongodb.net/db_betani?retryWrites=true&w=majority';
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
app.use('/petani', farmerRouter); // farmer
app.use('/cuaca', weatherRouter); // cuaca (per kota)

// Login
app.post('/api/login', async (req, res) => {
  const { username, password, role } = req.body;
  
  if(role == 'admin'){
    const a = await Admin.findOne({username}).lean(); // admin
    if(!a){
      return res.json({ status: 'error', error: 'Username tidak terdaftar!' });
    }
    else if(await bcrypt.compare(password, a.password)){

      const token = jwt.sign({ 
        id: a._id, 
        username: a.username,
        role: a.role 
      }, JWT_SECRET);

      return res.json({ status: 'ok', data: token });
    }
    else{
      res.json({ status: 'error', error: 'Password salah!' });
    }
  }

  else if(role == 'farmer'){
    const f = await Farmer.findOne({username}).lean(); // petani

    if(!f){
      return res.json({ status: 'error', error: 'Username tidak terdaftar!' });
    }
    else if(await bcrypt.compare(password, f.password)){

      const token = jwt.sign({ 
        id: f._id, 
        username: f.username,
        role: f.role 
      }, JWT_SECRET);

      return res.json({ status: 'ok', data: token });
    }
    else{
      res.json({ status: 'error', error: 'Password salah!' });
    }
  }
  
  else if(role == 'buyer'){
    const b = await Buyer.findOne({username}).lean(); // pembeli

    if(!b){
      return res.json({ status: 'error', error: 'Username tidak terdaftar!' });
    }
    else if(await bcrypt.compare(password,b.password)){

      const token = jwt.sign({ 
        id: b._id, 
        username: b.username,
        role: b.role 
      }, JWT_SECRET);

      return res.json({ status: 'ok', data: token });
    }
    else{
      res.json({ status: 'error', error: 'Password salah!' });
    }
  }

  else{
    res.json({ status: 'ok', data: 'Login hanya untuk admin, petani, dan pembali' });
  }
  
});

// REGISTRASI
app.post('/register', async (req, res) => {
  // Hashing the passwords
  const { nama, email, role, username, password: plainTextPassword } = req.body;

  if(!username || typeof username !== 'string'){
    return res.json({ status: 'error', error: 'Invalid Username' });
  }

  if(!plainTextPassword || typeof plainTextPassword !== 'string'){
    return res.json({ status: 'error', error: 'Invalid Password' });
  }

  if(plainTextPassword.length < 5) {
    return res.json({ 
      status: 'error', 
      error: 'Password Terlalu Pendek' 
    })
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  if(role == 'farmer'){
    const u = await Farmer.find({ "username": username });
    const e = await Farmer.find({"email": email});

    // console.log('inputan : ', nama);
    // console.log(u);

    if(u.length == 0 && e.length == 0){
      const res = await Farmers.create({
        nama,
        email,
        role,
        username,
        password
      });
      console.log('Berhasil Registrasi Petani sebagai : ', nama);
    }else{
      console.log('Username atau email sudah digunakan!');
    }
  }

  else if(role == 'admin'){
    const u = await Admin.find({ "username": username });
    const e = await Admin.find({"email": email});

    // console.log('inputan : ', nama);
    // console.log(u);

    if(u.length == 0 && e.length == 0){
      const res = await Admin.create({
        nama,
        email,
        role,
        username,
        password
      });
      console.log('Berhasil Registrasi Admin sebagai : ', nama);
    }else{
      console.log('Username atau email sudah digunakan!');
    }
  }

  else if(role == 'buyer'){
    const u = await Buyer.find({ "username": username });
    const e = await Buyer.find({"email": email});

    // console.log('inputan : ', nama);
    // console.log(u);

    if(u.length == 0 && e.length == 0){
      const res = await Buyer.create({
        nama,
        email,
        role,
        username,
        password
      });
      console.log('Berhasil Registrasi Pembeli sebagai : ', nama);
    }else{
      console.log('Username atau email sudah digunakan!');
    }
  }

  else{
    return res.json({ status: 'error', error: "Salah"} );
  }

  res.json({ status: 'ok' });

});


app.use('/petani', farmerRouter);

app.use('/pembeli', buyersRouter);
app.use('/pembeli/:buyerId', buyersRouter); 

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

// const port = process.env.PORT || 3000;
// app.listen(port);

module.exports = app;
