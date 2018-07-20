const articlesRouter = require('express').Router();
const {
  allArticles,
  individiualArticle,
  commentsByArticle,
  addCommentByArticle
} = require('../controllers/articles');

articlesRouter.route('/').get(allArticles);
articlesRouter.route('/:id')
  .get(individiualArticle)
  .put(individiualArticle);
articlesRouter.route('/:id/comments')
  .get(commentsByArticle)
  .post(addCommentByArticle);

articlesRouter.get('/*', (req, res, next) => {
  let err = 404
  console.log(`in errrorro`)
  return next(err, req, res, next)
})

module.exports = articlesRouter;