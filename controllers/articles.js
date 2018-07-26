const mongoose = require('mongoose');
const {
  Article,
  Comment
} = require('../models/index');
const {
  voteLogger
} = require("../utils/index")

const allArticles = (req, res, next) => {
  Article.find()
    .then(result => {
      return Promise.all([result, Comment.find()])
    })
    .then(([resultio, comments]) => {
      let result = voteLogger(resultio, comments)
      res.status(200).send({
        result
      });
    })
    .catch(next);
};

const individiualArticle = (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    Article.findById(req.params.id)
      .then(result => {
        result === null ?
          next({
            status: 404,
            msg: 'hihihi'
          }) :
          res.status(200).send({
            result
          });
      })
      .catch(next);
  } else {
    if (req.query.vote === 'up') {
      Article.findByIdAndUpdate(req.params.id, {
        votes: `${+1}`
      }, {
        upsert: true,
        new: true
      }, function (err, doc) {
        if (err) return next(err)
        if (!doc.belongs_to || doc === undefined) return next({
          status: 404
        })
        res.status(202).send(doc)
      })
    }
    if (req.query.vote === 'down') {
      Article.findByIdAndUpdate(req.params.id, {
        votes: `${-1}`
      }, {
        upsert: true,
        new: true
      }, function (err, doc) {
        if (err) return next(err)
        if (!doc.belongs_to) return next({
          status: 404
        })
        res.status(202).send(doc)
      })
    }
  }
};

const commentsByArticle = (req, res, next) => {
  Comment.find({
      belongs_to: `${req.params.id}`
    })
    .then(result => {
      result === null || result.length === 0 ?
        next({
          status: 404,
          msg: 'hihihi'
        }) :
        res.status(200).send({
          result
        });
    })
    .catch(next);
};

const addCommentByArticle = (req, res, next) => {
  req.body.belongs_to = req.params.id
  let newBody = new Comment(req.body)
  let belongs_to = req.params.article_id
  newBody.save()
    .then(result => {
      res.status(201).send({
        result
      })
    })
    .catch(next)
}

module.exports = {
  allArticles,
  individiualArticle,
  commentsByArticle,
  addCommentByArticle
}