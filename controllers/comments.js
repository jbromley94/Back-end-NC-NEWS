const mongoose = require('mongoose');
const {
  Comment
} = require('../models/index');

const individualComment = (req, res, next) => {
  console.log('in herherhwehfwvervbrljfhk;vn')
  if (req.query.vote === 'up') {
    Comment.findByIdAndUpdate(req.params.id, {
      votes: `${+1}`
    }, {
      upsert: true,
      new: true
    }, function (err, doc) {
      if (err) next(err)
      res.status(202).send(doc)
    })
  }
  if (req.query.vote === 'down') {
    Comment.findByIdAndUpdate(req.params.id, {
      votes: `${-1}`
    }, {
      upsert: true,
      new: true
    }, function (err, doc) {
      if (err) next(err)
      res.status(202).send(doc)
    })
  }
};

const youWillBeDeleted = (req, res, next) => {
  console.log(req.params.id)
  Comment.findByIdAndRemove(`${req.params.id}`)
  .then(result => {
    console.log(result)
  })
  .catch(next)
}


module.exports = {
  individualComment,
  youWillBeDeleted
}