const { Article, Comment, User } = require("../models/index");
const { commentLogger, upOrDownVote } = require("../utils/index");

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
  let query = req.query.vote;
  let id = req.params.id;
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
    upOrDownVote(query, id, res, next, Article);
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
    if(!req.body.created_by){
    req.body.created_by = users[0]._id;
    }
    let newBody = new Comment(req.body);
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
