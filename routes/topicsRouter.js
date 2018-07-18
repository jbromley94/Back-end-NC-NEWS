const topicsRouter = require('express').Router();
const {
  allTopics,
  articleForTopic
} = require('../controllers/topics');

topicsRouter.route('/').get(allTopics);
topicsRouter.route(`/:topic/articles`).get(articleForTopic)


topicsRouter.get('/*', (req, res, next) => {
  let err = 404
  console.log(`in errrorro`)
  return next(err, req, res, next)
})

module.exports = topicsRouter;