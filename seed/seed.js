const mongoose = require('mongoose');
mongoose.Promise = Promise;
const {
  formatSingleTopic,
  formatCommentsData,
  formatArticleData,
  formatSingleUser,
  formatData,
  createRef,
  renameKeyInArr
} = require('../utils/index')
const {
  Topic,
  User,
  Article,
  Comment
} = require('../models')

const seedDB = ({topicData, commentData, articleData, userData}) => {
  return mongoose.connection.dropDatabase()
    .then(() => {
      let formattedTopicData = formatData(topicData, formatSingleTopic);
      let formattedUserData = formatData(userData, formatSingleUser)
      return Promise.all([Topic.insertMany(formattedTopicData), User.insertMany(formattedUserData)])
    })
    .then(([topicDocs, userDocs]) => {
      let userRef = createRef(userData, userDocs);
      let topicRef = createRef(topicData, topicDocs)
      const formattedArticleData = formatArticleData(articleData, userRef, topicRef)
      renameKeyInArr(formattedArticleData)
      return Promise.all([Article.insertMany(formattedArticleData), userRef, topicDocs, userDocs])
    })
    .then(([articleDocs, userRefs, topicDocs, userDocs]) => {
      let articleRef = createRef(articleData, articleDocs)
      const formattedCommentsData = formatCommentsData(commentData, userRefs, articleRef)
      return Promise.all([Comment.insertMany(formattedCommentsData), articleDocs, topicDocs, userDocs])
    })
    .then(([commentDocs, articleDocs, topicDocs, userDocs, ]) => {
      return [topicDocs, commentDocs, articleDocs, userDocs]
    })
}

module.exports = seedDB;