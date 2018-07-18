const {
  sample
} = require('lodash')



const formatSingleTopic = topicDatum => {
  //the logic for a map, so it can be passed to the dataFormatter :D
  return { ...topicDatum
  }
}

const formatSingleUser = userDatum => {
  //the logic for a map, so it can be passed to the dataFormatter :D
  return { ...userDatum
  }
}

const formatData = (data, formatter) => {
  return data.map(formatter)
}

const createRef = (data, docs) => {
  return data.reduce((acc, currentDatum, index) => {
    //Because i have made a create Ref for both topic and user to go into I have done some logic so that neither of the keys becomes undefiend. Huzzah!
    if (currentDatum.username) {
      acc[currentDatum.username] = docs[index]._id;
    }
    if (currentDatum.slug) {
      acc[currentDatum.slug] = docs[index]._id;
    }
    if(currentDatum.title){
      acc[currentDatum.title] = docs[index]._id;
    }
    return acc;
  }, {})
}

const exchangeIDs = (oldItems, ref) => {
  if(typeof oldItems === 'string'){
    return ref[oldItems]
  } else{
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
      const{topic : belongs_to, created_by} = articleDatum
      // console.log(articleDatum.topic)
      // console.log(topicRef)
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
    // console.log(obj)
  })
}

const formatCommentsData = (commentData, userRefs, articleRef) => {
  return commentData.map(commentDatum => {
    const {
     belongs_to,
      created_by
    } = commentDatum
    // console.log(commentDatum.topic)
    // console.log(topicRef)
    return {
      ...commentDatum,
      belongs_to: exchangeIDs(belongs_to, articleRef),
      created_by: exchangeIDs(created_by, userRefs),
    }
  })
}








module.exports = {
  formatData,
  formatCommentsData,
  formatSingleTopic,
  formatArticleData,
  formatSingleUser,
  createRef,
  renameKeyInArr
}