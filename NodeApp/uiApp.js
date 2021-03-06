var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var uiApp = express();



//Change this to the script later
// var a = new IdCounter({counter: 0, type: "message"});
// a.save();
// view engine setup
uiApp.set('views', path.join(__dirname, 'views'));
uiApp.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
uiApp.use(logger('dev'));
uiApp.use(bodyParser.json());
uiApp.use(bodyParser.urlencoded({extended: false}));
uiApp.use(cookieParser());
uiApp.use(express.static(path.join(__dirname, 'public')));

uiApp.use(function (req, res, next) {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    // res.status(200);
    next();
});

// catch 404 and forward to error handler
uiApp.use(function (req, res, next) {
    return res.render('index');
});



module.exports = uiApp;
