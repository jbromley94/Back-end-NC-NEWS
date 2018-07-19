const mongoose = require('mongoose');
const {
  Topic,
  Article
} = require('../models/index');

const allTopics = (req, res, next) => {
      Topic.find()
        .then(result => {
          res.status(200).send({
            result
          });
        })
        .catch(err => {
          console.log(err);
          next(err);
        });
  };


  const articleForTopic = (req, res, next) => {
    console.log(req.params)
    Topic.find({slug : req.params.topic_slug})
    .then(topic => {
    return Article.find({belongs_to : topic[0].slug})
    })
    .then(result => {
      res.status(200).send({result})
    })
    .catch(next);
  }

  const articleToTopic = (req, res, next) => {
    let newBody = new Article(req.body)
    let topicId = req.params.topic_id
    newBody.save()
    .then(result => {
      res.status(201).send({result})
    })
    .catch(next)
  }

  module.exports = {
    allTopics,
    articleForTopic,
    articleToTopic
  }