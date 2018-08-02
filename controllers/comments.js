const { Comment } = require("../models/index");
const { upOrDownVote } = require("../utils/index");

const individualComment = (req, res, next) => {
  let query = req.query.vote;
  let id = req.params.id;
  upOrDownVote(query, id, res, next, Comment);
};

const youWillBeDeleted = (req, res, next) => {
  Comment.findByIdAndDelete(`${req.params.id}`)
    .then(deleted => {
      res
        .status(200)
        .send({
          deleted: deleted,
          msg: `The above comment has successfully been removed`
        });
    })
    .catch(next);
};

module.exports = {
  individualComment,
  youWillBeDeleted
};
