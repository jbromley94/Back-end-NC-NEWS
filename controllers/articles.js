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
    Article.findById(req.params.id)
      .then(result => {
        console.log(result)
        if (req.query.vote === 'down') {
          result.votes--
        }
        if (req.query.vote === 'up') {
          result.votes++
        }
          res.status(202).send({
            result
          });
      })
      .catch(next);
  }
};

const commentsByArticle = (req, res, next) => {
  Article.findById(req.params.id)
    //Now i've found the article i just need to pass that id to comments

    .then(article => {
      console.log(article.title, "<<<<<<<<<<<<<<<<<<<,")
      Comment.find({
        belongs_to: `${article.title}`
      })
    })
    .then(result => {
      console.log(">>>>>>>>>>>>>>>>", result)
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