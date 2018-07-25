const mongoose = require('mongoose');
const {
  Topic,
  Article,
  Comment
} = require('../models/index');

const allTopics = (req, res, next) => {
  Topic.find()
    .then(result => {
      res.status(200).send({
        result
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
      let result = resultio.reduce((acc, current, index) => {
        let obj = {}
        obj.votes = current.votes
        obj._id = current._id
        obj.title = current.title
        obj.created_by = current.created_by
        obj.body = current.body
        obj.created_at = current.created_at
        obj.belongs_to = current.belongs_to
        obj.__v = current.__v
        obj.comment_count = 0
        for(let i = 0; i<comments.length; i++){
          if(comments[i].belongs_to.toString() === obj._id.toString()){
            obj.comment_count += 1
          }
        }
        acc.push(obj)
        return acc
      }, [])
      res.status(200).send({result})
    })
    .catch(next);
}

const articleToTopic = (req, res, next) => {
  let newBody = new Article(req.body)
  let topicId = req.params.topic_id
  newBody.save()
    .then(result => {
      res.status(201).send({
        result
      })
    })
    .catch(next)
}

module.exports = {
  allTopics,
  articleForTopic,
  articleToTopic
}