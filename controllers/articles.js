const mongoose = require("mongoose");
const { Article, Comment, User } = require("../models/index");
const { commentLogger } = require("../utils/index");

const allArticles = (req, res, next) => {
  Article.find()
    .then(result => {
      return Promise.all([result, Comment.find()]);
    })
    .then(([resultio, comments]) => {
      let all_articles = commentLogger(resultio, comments);
      res.status(200).send({
        all_articles
      });
    })
    .catch(next);
};

const individiualArticle = (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    Article.findById(req.params.id)
      .then(article => {
        article === null
          ? next({
              status: 404
            })
          : res.status(200).send({
              article
            });
      })
      .catch(next);
  } else {
    if (req.query.vote === "up") {
      Article.findByIdAndUpdate(
        req.params.id,
        { $inc: { votes: 1 } },
        {
          upsert: true,
          new: true
        },
        function(err, doc) {
          if (err) return next(err);
          if (!doc.belongs_to || doc === undefined)
            return next({
              status: 404
            });
          res.status(202).send(doc);
        }
      );
    }
    if (req.query.vote === "down") {
      Article.findByIdAndUpdate(
        req.params.id,
        { $inc: { votes: -1 } },
        {
          upsert: true,
          new: true
        },
        function(err, doc) {
          if (err) return next(err);
          if (!doc.belongs_to)
            return next({
              status: 404
            });
          res.status(202).send(doc);
        }
      );
    }
  }
};

const commentsByArticle = (req, res, next) => {
  Comment.find({
    belongs_to: `${req.params.id}`
  })
    .then(comments_by_article => {
      comments_by_article === null || comments_by_article.length === 0
        ? next({
            status: 404
          })
        : res.status(200).send({
            comments_by_article
          });
    })
    .catch(next);
};

const addCommentByArticle = (req, res, next) => {
  User.find().then(users => {
    req.body.belongs_to = req.params.id;
    req.body.created_by = users[0]._id;
    let newBody = new Comment(req.body);
    let belongs_to = req.params.article_id;
    newBody
      .save()
      .then(added => {
        res.status(201).send({
          added
        });
      })
      .catch(next);
  });
};

module.exports = {
  allArticles,
  individiualArticle,
  commentsByArticle,
  addCommentByArticle
};
