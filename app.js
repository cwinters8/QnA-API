const express = require('express');
const jsonParser = require('body-parser').json;
const logger = require('morgan');

const routes = require('./routes');

'use strict';

const app = express();

// middleware
app.use(logger('dev'));
app.use(jsonParser());
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