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

module.exports = articlesRouter;