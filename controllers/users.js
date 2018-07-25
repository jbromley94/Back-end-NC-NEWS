const mongoose = require('mongoose');
const {
  User,
  Article,
  Comment
} = require('../models/index');

const allUsers = (req, res, next) => {
  User.find()
    .then(result => {
      res.status(200).send({
        result
      });
    })
    .catch(err => {
      next(err);
    });
};

const userById = (req, res, next) => {
  User.findById(req.params.user)
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
    .catch(err => {
      next(err);
    });
};

module.exports = {
  allUsers,
  userById
}