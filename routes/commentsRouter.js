const commentsRouter = require('express').Router();
const {
  individualComment,
  youWillBeDeleted
} = require('../controllers/comments');

commentsRouter.route('/:id').put(individualComment)
.delete(youWillBeDeleted);


commentsRouter.get('/*', (req, res, next) => {
  let err = 404
  console.log(req.params)
  console.log(`in errrorro`)
  return next(err, req, res, next)
})

module.exports = commentsRouter;