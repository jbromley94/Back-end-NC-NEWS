const mongoose = require('mongoose');
const {
  Comment
} = require('../models/index');

const individiualComment = (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    Comment.findById(req.params.id)
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
    console.log(req)
    Comment.findById(req.params.id)
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

module.exports = individiualComment