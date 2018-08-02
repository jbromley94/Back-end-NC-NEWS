const {DB_URL} = require(`../db/config`)
const data = require("./devData")
const seedDB = require('./seed');
const mongoose = require('mongoose');

mongoose.connect(DB_URL, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log(`connected to ${DB_URL}`)
  })
  .then(() => {
    return seedDB(data);
  })
  .then(() => {
    console.log(`Topic, Comment, Article and User seed complete.`)
    return mongoose.disconnect()
  })