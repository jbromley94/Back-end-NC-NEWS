const {
  Topic,
  Article,
  Comment
} = require('../models/index');
const {
  commentLogger
} = require("../utils/index")

const allTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.status(200).send({
        topics
      });
    })
    .catch(err => {
      next(err);
    });
};

const articleForTopic = (req, res, next) => {
  Topic.find({
      slug: req.params.topic_slug
    })
    .then(topic => {
      return Article.find({
        belongs_to: topic[0].slug
      })
    })
    .then(result => {
      return Promise.all([result, Comment.find()])
    })
    .then(([resultio, comments]) => {
      let articles_by_topic = commentLogger(resultio, comments)
      res.status(200).send({
        articles_by_topic
      })
    })
    .catch(next);
}

const articleToTopic = (req, res, next) => {
  req.body.belongs_to = req.params.topic_slug
  let newBody = new Article(req.body)
  newBody.save()
    .then(posted_article => {
      res.status(201).send({
        posted_article
      })
    })
    .catch(next)
}

module.exports = {
  allTopics,
  articleForTopic,
  articleToTopic
}