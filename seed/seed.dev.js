process.env.NODE_ENV = "dev";

const {DB_URL} = require(`../db/index`)
console.log(DB_URL)
const
  topicData = require('./testData/topics.json')
const
  articleData = require('./testData/articles.json')
const
  userData = require('./testData/users.json');
const
  commentData = require('./testData/comments.json')
const seedDB = require('./seed');
const mongoose = require('mongoose');

mongoose.connect(DB_URL, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log(`connected to ${DB_URL}`)
  })
  .then(() => {
    return seedDB(topicData, commentData, articleData, userData)
  })
  .then(() => {
    return mongoose.disconnect()
  })