const articlesRouter = require('express').Router();
const {
  allArticles,
  individiualArticle,
  commentsByArticle
} = require('../controllers/articles');

articlesRouter.route('/').get(allArticles);
articlesRouter.route('/:id').get(individiualArticle);
articlesRouter.route('/:id/comments').get(commentsByArticle);

articlesRouter.get('/*', (req, res, next) => {
  let err = 404
  console.log(`in errrorro`)
  return next(err, req, res, next)
})

module.exports = articlesRouter;