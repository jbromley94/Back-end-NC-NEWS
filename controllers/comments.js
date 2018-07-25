const mongoose = require('mongoose');
const {
  Comment
} = require('../models/index');

const individualComment = (req, res, next) => {
  if (req.query.vote === 'up') {
    Comment.findByIdAndUpdate(req.params.id, {
      votes: `${+1}`
    }, {
      upsert: true,
      new: true
    }, function (err, doc) {
      if (err) return next(err)
      if (!doc.belongs_to) return next({
        status: 404
      })
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
      if (err) return next(err)
      if (!doc.belongs_to) return next({
        status: 404
      })
      res.status(202).send(doc)
    })
  }
};

const youWillBeDeleted = (req, res, next) => {
  Comment.findByIdAndDelete(`${req.params.id}`)
  .then(deleted => {
    res.status(200).send({deleted: deleted, msg: `The above comment has successfully been removed`})
  })
  .catch(next)
}

module.exports = {
  individualComment,
  youWillBeDeleted
}