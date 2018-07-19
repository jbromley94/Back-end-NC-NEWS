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


const seedDB = (topicData, commentData, articleData, userData) => {
  return mongoose.connection.dropDatabase()
    .then(() => {

      //need to do user and topic first as the have no refs in the schema. So are good to roll str8 away

      let formattedTopicData = formatData(topicData, formatSingleTopic);
      let formattedUserData = formatData(userData, formatSingleUser)

      //return with a promise.all as it will be an array now, I shall then destruct at .then time :)

      return Promise.all([Topic.insertMany(formattedTopicData), User.insertMany(formattedUserData)])
    })
    //it is now time for articles, this is because the comments reference the articles mongoId. Time to get going. 
    .then(([topicDocs, userDocs]) => {

      //Firstly i shall make the references for user

      let userRef = createRef(userData, userDocs);
      let topicRef = createRef(topicData, topicDocs)

      //I can now format the articleData 

      const formattedArticleData = formatArticleData(articleData, userRef, topicRef)

      //I shall now run it through my function to makke the keys approriate names to be caught by the schema. Getting there :D

      renameKeyInArr(formattedArticleData)
   
      //I shall also pass down the userRefs, this is because they are needed for the comments, Promise.all will give the strength i need, not emotionally though

      return Promise.all([Article.insertMany(formattedArticleData), userRef, topicDocs, userDocs])
    })
    .then(([articleDocs, userRefs, topicDocs, userDocs]) => {

      //the userRefs are already passed, time to make some articlle refs

      let articleRef = createRef(articleData, articleDocs)
      const formattedCommentsData = formatCommentsData(commentData, userRefs, articleRef)

      // By jove i think hes done it 

      return Promise.all([Comment.insertMany(formattedCommentsData), articleDocs, topicDocs, userDocs])
    })
    .then(([commentDocs, articleDocs, topicDocs, userDocs, ]) => {
      console.log('Topic, Comment, Article and User seed complete.');
      return [topicDocs, commentDocs, articleDocs, userDocs]
    })
}

module.exports = seedDB;