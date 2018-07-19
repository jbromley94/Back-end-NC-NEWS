const commentsRouter = require('express').Router();
const {
  individiualComment
} = require('../controllers/comments');

commentsRouter.route('/:id').get(individiualComment);


commentsRouter.get('/*', (req, res, next) => {
  let err = 404
  console.log(`in errrorro`)
  return next(err, req, res, next)
})

module.exports = commentsRouter;