const usersRouter = require('express').Router();
const {
  userById,
  allUsers
} = require('../controllers/users');

usersRouter.route(`/:user`).get(userById)
usersRouter.route(`/`).get(allUsers)

module.exports = usersRouter;