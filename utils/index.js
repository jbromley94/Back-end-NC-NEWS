const formatSingleTopic = topicDatum => {
  return { ...topicDatum
  }
}

const formatSingleUser = userDatum => {
  return { ...userDatum
  }
}

const formatData = (data, formatter) => {
  return data.map(formatter)
}

const createRef = (data, docs) => {
  return data.reduce((acc, currentDatum, index) => {
    if (currentDatum.username) {
      acc[currentDatum.username] = docs[index]._id;
    }
    if (currentDatum.slug) {
      acc[currentDatum.slug] = docs[index].slug;
    }
    if (currentDatum.title) {
      acc[currentDatum.title] = docs[index]._id;
    }
    return acc;
  }, {})
}

const exchangeIDs = (oldItems, ref) => {
  if (typeof oldItems === 'string') {
    return ref[oldItems]
  } else {
    return oldItems.reduce((acc, oldItem) => {
      let oldID = typeof oldItem === 'object' ? oldItem.id : oldItem;
      const newID = ref[oldID];
      newID ? acc.push(newID) : null;
      return acc;
    }, []);
  }
}

const formatArticleData = (articleData, userRef, topicRef) => {
  return articleData.map(articleDatum => {
    articleDatum.vote = 0
    const {
      topic: belongs_to,
      created_by
    } = articleDatum
    return {
      ...articleDatum,
      topic: exchangeIDs(belongs_to, topicRef),
      created_by: exchangeIDs(created_by, userRef),
    }
  })
}

const renameKeyInArr = (arrObj) => {
  return arrObj.map(obj => {
    obj.belongs_to = obj.topic
  })
}

const formatCommentsData = (commentData, userRefs, articleRef) => {
  return commentData.map(commentDatum => {
    const {
      belongs_to,
      created_by
    } = commentDatum
    return {
      ...commentDatum,
      belongs_to: exchangeIDs(belongs_to, articleRef),
      created_by: exchangeIDs(created_by, userRefs),
    }
  })
}

const commentLogger = (arr, comms) => {
  let thing = arr.reduce((acc, current) => {
    let obj ={
    votes : current.votes,
    _id : current._id,
    title : current.title,
    created_by : current.created_by,
    body : current.body,
    created_at : current.created_at,
    belongs_to : current.belongs_to,
    __v : current.__v
    }
    obj.comment_count = 0
    for (let i = 0; i < comms.length; i++) {
      if (comms[i].belongs_to.toString() === obj._id.toString()) {
        obj.comment_count += 1
      }
    }
    acc.push(obj)
    return acc
  }, [])
  return thing
}

const upOrDownVote = (query, id, res, next, Context) => {
  if (query === "up") {
    Context.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } },
      {
        upsert: true,
        new: true
      },
      function (err, doc) {
        if (err) return next(err);
        if (!doc.belongs_to || doc === undefined)
          return next({
            status: 404
          });
        res.status(202).send(doc);
      }
    );
  } 
  if (query === "down") {
    Context.findByIdAndUpdate(
      id,
      { $inc: { votes: -1 } },
      {
        upsert: true,
        new: true
      },
      function (err, doc) {
        if (err) return next(err);
        if (!doc.belongs_to)
          return next({
            status: 404
          });
        res.status(202).send(doc);
      }
    );
  }
}

module.exports = {
  formatData,
  upOrDownVote,
  commentLogger,
  formatCommentsData,
  formatSingleTopic,
  formatArticleData,
  formatSingleUser,
  createRef,
  renameKeyInArr
}