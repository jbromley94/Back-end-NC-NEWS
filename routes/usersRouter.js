const usersRouter = require('express').Router();
const {
  userById,
  allUsers
} = require('../controllers/users');

usersRouter.route(`/:user`).get(userById)
usersRouter.route(`/`).get(allUsers)

usersRouter.get('/*', (req, res, next) => {
  let err = 404
  console.log(`in errrorro`)
  return next(err, req, res, next)
})

module.exports = usersRouter;