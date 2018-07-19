const mongoose = require('mongoose');
const {
  Article,
  Comment
} = require('../models/index');

const allArticles = (req, res, next) => {
  Article.find()
    .then(result => {
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
    }, {upsert : true, 
      new: true
    }, function (err, doc) {
      if (err) next(err)
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
      if (err) next(err)
      res.status(202).send(doc)
    })
  }
}
};

const commentsByArticle = (req, res, next) => {
  Comment.find({belongs_to : `${req.params.id}`})
    .then(result => {
      res.status(200).send({
        result
      });
    })
    .catch(next);
};

module.exports = {
  allArticles,
  individiualArticle,
  commentsByArticle
}