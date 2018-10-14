"use strict";
//set timezone here.
process.env.TZ = 'Asia/Shanghai';

var debug = require('debug')('neapp:server');
var http = require('http');

var expressValidator = require('express-validator');
var expressSession = require('express-session');
require('dotenv').load();
var express = require("express");
var path = require('path');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

var errorHandler = require("errorhandler");
var passport = require('passport');
//load models
require('./app_api/models/db');
//require('./app_api/config/passport');

var routes = require("./app_server/routes/index");
var routesApi = require('./app_api/routes/index');

//var dst = require('./utils/datasyntask.js');

var log4js = require('log4js');
log4js.configure({
    appenders: {
        console: {type: "console"},
        logInfo: {type: "dateFile", filename: "./logs/info/logInfo.log", pattern: ".yyyy-MM-dd"},
        logDebug: {type: "dateFile", filename: "./logs/debug/logDebug.log", pattern: ".yyyy-MM-dd"},
        logWarn: {type: "dateFile", filename: "./logs/warn/logWarn.log", pattern: ".yyyy-MM-dd"},
        logError: {type: "dateFile", filename: "./logs/error/logError.log", pattern: ".yyyy-MM-dd"}
    },
    categories: {
        default: {appenders: ["console"], level: "trace"},
        logInfo: {appenders: ["console", "logInfo"], level: "info"},
        logDebug: {appenders: ["console", "logDebug"], level: "debug"},
        logWarn: {appenders: ["console", "logWarn"], level: "warn"},
        logErr: {appenders: ["console", "logError"], level: "error"}
    },
    replaceConsole: true
});
var app = express();
var log = require('./app_api/common/util/apiLogHelper');
var logHelper = log.helper;
log.use(app);

// Configuration
app.set('views', path.join(__dirname, 'app_server', 'views'));
// app.set('view engine', 'pug');
app.set('view engine', '.hbs');

//app.set('view options', { layout: false });
//app.use(bodyParser.json());
app.use(bodyParser.xml({
  limit: '2MB', // Reject payload bigger than 1 MB
  xmlParseOptions: {
    normalize: true, // Trim whitespace inside text nodes
    normalizeTags: true, // Transform tags to lowercase
    explicitArray: false // Only put nodes in array if >1
  },
  verify: function (req, res, buf, encoding) {
    if (buf && buf.length) {
      // Store the raw XML
      req.rawBody = buf.toString(encoding || "utf8");
    }
  }
}));
app.use(bodyParser.urlencoded({
  limit: '32mb', extended: true
}));
app.use(bodyParser.json({
  limit: '32mb'
}));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(cookieParser());

//app.use(logger(':date[iso] :method :url :status :res[content-length] :response-time ms'));

//app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));
/*
var cutil = require('./app_api/common/util/apiCommUtil');
var sutil = require('./app_api/common/util/apiScheduleUtil');
var pushOrder = require('./app_api/common/util/apiPushOrder');//*/
var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  app.use(errorHandler());
}
// Routes
app.use('/', routes);
app.use(passport.initialize());

// app.use(function (req, res, next) {
//   var url = req.originalUrl;
//   var fdStart = url.indexOf("/api");
//   if(fdStart != -1 && req.connection){
//     logHelper.info("接收APP请求地址：" + req.connection.remoteAddress);
//     logHelper.info("接收APP请求路径：" + url);
//   }
//   next();
// });
app.use('/api', routesApi);


//监听未捕获的异常
process.on('uncaughtException', function (err) {
  logHelper.error('log uncaughtException error', err)
})
//监听Promise没有被捕获的失败函数
process.on('unhandledRejection', function (err, promise) {
  logHelper.error('log unhandledRejection error ', err)
  logHelper.error('log unhandledRejection promise ', promise)
})

// catch 404 and forward to error handler
//redirect to / for angular app
app.use(function (req, res, next) {
  res.status(404).json({error: `${req.url} Not found.`}).end();
  /*
  var err = new Error('Not Found');
  err.status = 404;
  //console.log(err);
  //res.redirect('/');
  next(err);//*/
  /*/ respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');//*/
});//*/


//*
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//*/

//app.listen(process.env.PORT || 8080, function () {
//console.log("Demo Express server listening on port %d in %s mode", 8080, app.settings.env);
//});
var port = normalizePort(process.env.PORT || '3000');
//console.log('port:'+port)
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
app.set('port', port);

//
/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

//record server startTime,for use later.
var startTime = Date.now();
app.locals.startTime = startTime;
app.locals.dataSyncTask = {};
app.locals.inspectNodeTask = {};
app.locals.verCodeTimer = {};
app.locals.itemClick = {};
app.locals.longTaskInfo = {};
/*
cutil.getHospitals(app)
cutil.getAppVersion(app)
cutil.getSystemSetting(app)

sutil.setSchedule(app)
pushOrder.setOrderTimeout()
//*/
/*/最下面
var https = require('https'),fs = require("fs");

var options = {
  key: fs.readFileSync('./app_api/config/ssl/privatekey.pem'),
  cert: fs.readFileSync('./app_api/config/ssl/certificate.pem')
};

https.createServer(options, app).listen(3011, function () {
  console.log('Https server listening on port ' + 3011);
});//*/

// dst.deployDataSynTask(app);
// var taskID1 = dst.deployDataSynTask('url1',5000);
// app.locals.taskID1 = taskID1;
// console.log('JWT_SECRET='+process.env.JWT_SECRET);
exports.App = app;
