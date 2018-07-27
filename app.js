const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || require("./db/config").DB_URL;

mongoose.connect(DB_URL, {
  useNewUrlParser: true
});

app.use(bodyParser.json(), express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('home'));
app.get('/README.md', (req, res) => {
   res.render("readme")
})
app.use('/api', apiRouter);

app.use(function (err, req, res, next) {
  if (err === 404 || err.status === 404) {
    res.status(404).send({
      msg: 'These are not the droids you\'re looking for',
      NOT_FOUND: `Given Path or Field is invalid`
    });
  }
  else next(err)
});

app.use(function (err, req, res, next) {
  if (err.name === "TypeError") {
    res.status(404).send({
      msg: err.message,
      NOT_FOUND: `Given topic is invalid`
    });
  }
  else next(err)
});

app.use(function (err, req, res, next) {
  if (err.name === "CastError") {
      res.status(400).send({
      msg: `The correct parameters for this request not met. See below for details`,
      BAD_REQUEST: `Your input of ${err.value} is not appropriate to complete the search : The parameters REQUIRE a relevant 24digit hash`
    });
  } 
  else next(err)
});

app.use(function (err, req, res, next) {
  if (err.status === 400) {
    res.status(400).send({
      msg: `The correct parameters for this request not met. See below for details`,
      BAD_REQUEST: `Your input of ${err.user} is not appropriate to complete the search : The parameters REQUIRE an existing username`
    });
  } else next(err)
});

app.use(function (err, req, res, next) {
  if (err.name === "ValidationError") {
    errArrString = Object.keys(err.errors).join(', ')
    res.status(400).send({
      msg: `The correct parameters for post request not met. See below for details`,
      BAD_REQUEST : `The following are REQUIRED for a successful post: ${errArrString}`
    });
  } else {
  res.status(500).send({
    msg: 'Internal Server Error'
  });
}
});

module.exports = app;