const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/northcoderNews';

mongoose.connect(DB_URL);

app.use(bodyParser.json(), express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('home.ejs'));
app.use('/api', apiRouter);

app.use(function (err, req, res, next) {
  console.log(err, '<<<<<<<<<');
  if (err === 404) {
    res.status(404).send({
      msg: 'These are not the droids you\'re looking for'
    });
  }
  if (err === 400) {
    res.status(400).send({
      msg: 'These are NOT appropriate parameters mate'
    });
  }
  res.status(500).send({
    msg: 'Internal Server Error'
  });
});


module.exports = app;