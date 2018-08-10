const {
  User,
  Article
} = require('../models/index');

const allUsers = (req, res, next) => {
  User.find()
    .then(all_users => {
      res.status(200).send({
        all_users
      });
    })
    .catch(next);
};

const articlesForUser = (req, res, next) => {
  User.find({
    username: req.params.user
  }).then(user => {
    return Article.find({
      created_by: user[0]._id
    })
  }).then(all_articles => {
    res.status(200).send({all_articles})
  })
}

const userById = (req, res, next) => {
  User.find({
      username: req.params.user
    })
    .then(user => {
      if (user.length === 0 && req.params.user.length === 24) {
        return next({
          status: 404
        })
      }
      if (user.length === 0) {
        return next({
          status: 400,
          user: req.params.user
        })
      }
      res.status(200).send({
        user
      });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = {
  allUsers,
  userById,
  articlesForUser
};