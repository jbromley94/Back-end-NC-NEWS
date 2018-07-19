const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const articlesRouter = require('./articlesRouter');
const usersRouter = require('./usersRouter');
const commentsRouter = require('./commentsRouter');
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/topics', topicsRouter);

apiRouter.get('/*', (req, res, next) => {
  let err = 404;
  return next(err, req, res, next);
});


module.exports = apiRouter;