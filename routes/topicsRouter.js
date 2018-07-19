const topicsRouter = require('express').Router();
const {
  allTopics,
  articleForTopic,
  articleToTopic
} = require('../controllers/topics');

topicsRouter.route('/').get(allTopics);
topicsRouter.route(`/:topic_slug/articles`).get(articleForTopic)
topicsRouter.route(`/:topic_id/articles`).post(articleToTopic)


topicsRouter.get('/*', (req, res, next) => {
  let err = 404
  console.log(`in errrorro`)
  return next(err, req, res, next)
})

module.exports = topicsRouter;