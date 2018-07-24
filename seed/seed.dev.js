const {DB_URL} = require(`../db/config`)
const
  topicData = require('./devData/topics.json')
const
  articleData = require('./devData/articles.json')
const
  userData = require('./devData/users.json');
const
  commentData = require('./devData/comments.json')
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