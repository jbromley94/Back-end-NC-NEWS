const mongoose = require('mongoose');
const {
  Topic,
  Article,
  Comment
} = require('../models/index');
const {voteLogger} = require("../utils/index")

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

      // res.status(200).send({result})
    })
    .then(([resultio, comments]) => {
      let result = voteLogger(resultio, comments)
      res.status(200).send({result})
    })
    .catch(next);
}

const articleToTopic = (req, res, next) => {
  let newBody = new Article(req.body)
  let topicId = req.params.topic_id
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