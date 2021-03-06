const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const admin = require("firebase-admin");

const app = express();



const serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://glopper-f830f.firebaseio.com"
// });



// Global Veriable
global.url = 'http://localhost:3000/';
console.log(`nodesj express listening on port ${global.url}`);


app.get('/login', (req, res) => {
  res.render('auth/login')
})


app.get('/signup', (req, res) => {
  res.render('auth/signup')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const map = require('./routes/map');
const news = require('./routes/news');
const covid = require('./routes/covid');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser('GlopperSecret'));
app.use(logger('dev'));
app.use(expressLayouts);
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);


app.use(session({
  cookie: { maxAge: 60000 },
  saveUninitialized: true,
  resave: false,
  secret: 'GlopperSecret'
}));

app.use(flash());
app.use((req, res, next) => {
  if (req.session && req.session.flash && req.session.flash.length > 0) {
    req.session.flash = [];
  }
  next();
});


app.use('/', map);
app.use('/news', news);
app.use('/covid', covid);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in develo pment
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
