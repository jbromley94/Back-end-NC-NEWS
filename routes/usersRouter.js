const usersRouter = require('express').Router();
const { userById, allUsers, articlesForUser } = require("../controllers/users");

usersRouter.route(`/:user`).get(userById)
usersRouter.route(`/`).get(allUsers)
usersRouter.route('/:user/articles').get(articlesForUser)

module.exports = usersRouter;