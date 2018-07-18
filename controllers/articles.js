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
      .catch(err => {
        console.log(err);
        next(err);
      });
};

const individiualArticle = (req, res, next) => {
    Article.find({_id : req.params.id})
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

const commentsByArticle = (req, res, next) => {
  Article.find({
      _id : req.params.id
    })
    //Now i've found the article i just need to pass that id to comments

    .then(article => {
      console.log(article)
      return Comment.find({
        belongs_to: article[0]._id
      })
    })
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

module.exports = {
  allArticles,
  individiualArticle,
  commentsByArticle
}