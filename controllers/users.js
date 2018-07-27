const mongoose = require('mongoose');
const {
  User,
  Article,
  Comment
} = require('../models/index');

const allUsers = (req, res, next) => {
  User.find()
    .then(all_users => {
      res.status(200).send({
        all_users
      });
    })
    .catch(err => {
      next(err);
    });
};

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
  userById
}