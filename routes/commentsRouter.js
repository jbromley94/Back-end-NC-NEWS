const commentsRouter = require('express').Router();
const {
  individualComment,
  youWillBeDeleted,
} = require('../controllers/comments');

commentsRouter.route('/:id').put(individualComment)
.delete(youWillBeDeleted);

module.exports = commentsRouter;