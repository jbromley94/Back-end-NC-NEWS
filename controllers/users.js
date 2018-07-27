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
  User.findById(req.params.user)
    .then(user => {
     user === null ?
       next({
         status: 404
       }) :
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