// Configure process.env based on a .env file, thus avoiding of messing with
// System environment variables
require("dotenv").config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const appNameRouter = require('./routes/appname');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// First lookup in build folder, to handle React static files.
// Second, if not found by React, use our public folder.
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/appname', appNameRouter);

// Any route we have not handled at the server, will be handled by client's
// routing (index.html)
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

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
