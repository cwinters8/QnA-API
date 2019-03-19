const express = require('express');
const jsonParser = require('body-parser').json;
const logger = require('morgan');
const mongoose = require('mongoose');

const routes = require('./routes');

'use strict';

const app = express();

// middleware
app.use(logger('dev'));
app.use(jsonParser());

// database
mongoose.connect('mongodb://localhost:27017/qa', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (err) => {
  console.error("connection error:", err);
});
db.once('open', () => {
  console.log('DB connection successful');
});

// router
app.use("/questions", routes);

// catch 404 errors and pass to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// run the app
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));