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
    Topic.find({slug : req.params.topic})
    .then(topic => {
    return Article.find({belongs_to : topic[0]._id})
    })
    .then(result => {
      res.status(200).send({result})
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
  }

  module.exports = {
    allTopics,
    articleForTopic
  }