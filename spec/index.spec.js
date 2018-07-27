process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const {
  expect
} = require("chai");
const mongoose = require("mongoose");
const seedDB = require("../seed/seed.js");
const
  topicData = require('../seed/testData/topics.json')
const
  articleData = require('../seed/testData/articles.json')
const
  userData = require('../seed/testData/users.json');
const
  commentData = require('../seed/testData/comments.json')
const testData = require('../seed/testData');


describe('', () => {
  let topicDocs;
  let commentDocs;
  let articleDocs;
  let userDocs
  beforeEach(() => {
    return seedDB(topicData, commentData, articleData, userData)
      .then(docs => {
        [topicDocs, commentDocs, articleDocs, userDocs] = docs;
      })
  })
  after(() => {
    return mongoose.disconnect();
  })
  describe('northcoderNews', () => {
    describe("topics", () => {
      it("T1-GET responds 200 and all topics", () => {
        return request.get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.topics[0]).to.contain.keys("title", "slug")
            expect(res.body.topics).to.be.an("Array")
            expect(res.body.topics.length).to.equal(2)
          })
      })
      it("T2-GET responds 404 when topics is misspelt", () => {
        return request.get("/api/topic")
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "NOT_FOUND")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.NOT_FOUND).to.equal(`Given Path or Field is invalid`)
          })
      })
      it("T3-GET responds 200 and specific articles of given topic", () => {
        return request.get("/api/topics/mitch/articles")
          .expect(200)
          .then(res => {
            expect(res.body.articles_by_topic).to.be.an("Array")
            expect(res.body.articles_by_topic[0]).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes", "comment_count")
            expect(res.body.articles_by_topic.length).to.equal(2)
            expect(res.body.articles_by_topic[0].comment_count).to.equal(2)
            expect(res.body.articles_by_topic[1].comment_count).to.equal(2)
          })
      })
      it("T4-GET responds 404 for a topic that does not exist", () => {
        return request.get("/api/topics/mich/articles")
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "NOT_FOUND")
            expect(res.body.msg).to.equal(`Cannot read property 'slug' of undefined`)
            expect(res.body.NOT_FOUND).to.equal(`Given topic is invalid`)
          })
      })
      it('T5- POST responds with 400 for an incorrectly structured post', () => {
        const topicId = topicDocs[0]._id
        return request.post(`/api/topics/${topicId}/articles`)
          .send({
            anything: 'blah blah blah'
          })
          .expect(400)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal(`The correct parameters for post request not met. See below for details`)
            expect(res.body.BAD_REQUEST).to.equal(`The following are REQUIRED for a successful post: created_by, body, title`)
          })
      })
      it('T6- POST responds with 201 for a correctly structured post', () => {
        const topic_slug = 'mitch'
        return request.post(`/api/topics/${topic_slug}/articles`)
          .send({
            votes: 0,
            title: 'The Man, The Master, The Meme',
            created_by: '5b507350c6aab01c1f82121b',
            body: 'What a fine gentleman, and a scholar',
          })
          .expect(201)
          .then(res => {
            expect(res.body.posted_article).to.be.an("Object")
            expect(res.body.posted_article).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes")
          })
      })
    })
    describe("articles", () => {
      it("A1-GET responds 200 and all articles", () => {
        return request.get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.all_articles).to.be.an("Array")
            expect(res.body.all_articles[0]).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes", "comment_count")
            expect(res.body.all_articles.length).to.equal(4)
            expect(res.body.all_articles[0].comment_count).to.equal(2)
            expect(res.body.all_articles[1].comment_count).to.equal(2)
            expect(res.body.all_articles[2].comment_count).to.equal(2)
            expect(res.body.all_articles[3].comment_count).to.equal(2)
          })
      })
      it("A2-GET responds 404 when articles is misspelt", () => {
        return request.get("/api/article")
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "NOT_FOUND")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.NOT_FOUND).to.equal(`Given Path or Field is invalid`)
          })
      })
      it("A3-GET responds 200 when searching for articles by id", () => {
        return request.get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body.article).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes")
            expect(res.body.article.body).to.equal("I find this existence challenging")
          })
      })
      it("A4-GET responds 404 when incorrect id hash from another collection", () => {
        return request.get(`/api/articles/${topicDocs[0]._id}`)
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "NOT_FOUND")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.NOT_FOUND).to.equal(`Given Path or Field is invalid`)
          })
      })
      it("A5-GET responds 400 when incorrect input used", () => {
        return request.get(`/api/articles/mitch`)
          .expect(400)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal(`The correct parameters for this request not met. See below for details`)
            expect(res.body.BAD_REQUEST).to.equal(`Your input of mitch is not appropriate to complete the search : The parameters REQUIRE a relevant 24digit hash`)
          })
      })
      it("A6-GET responds 200 when searching for comments by articles by id", () => {
        return request.get(`/api/articles/${articleDocs[0]._id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body.comments_by_article).to.be.an("Array")
            expect(res.body.comments_by_article[0]).to.contain.keys("body", "created_by", "created_at", "belongs_to", "votes")
            expect(res.body.comments_by_article[0].body).to.equal("Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.")
          })
      })
      it("A6.5-GET responds 400 when incorrect input used", () => {
        return request.get(`/api/articles/mitch/comments`)
          .expect(400)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal(`The correct parameters for this request not met. See below for details`)
            expect(res.body.BAD_REQUEST).to.equal(`Your input of mitch is not appropriate to complete the search : The parameters REQUIRE a relevant 24digit hash`)
          })
      })
      it("A6.75-GET responds 404 when incorrect id hash from another collection", () => {
        return request.get(`/api/articles/${topicDocs[0]._id}/comments`)
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "NOT_FOUND")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.NOT_FOUND).to.equal(`Given Path or Field is invalid`)
          })
      })
      it("A7-PUT responds 201 when incrementing vote down", () => {
        return request.put(`/api/articles/${articleDocs[0]._id}?vote=down`)
          .expect(202)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("created_at", "votes", "belongs_to", "created_by")
            expect(res.body.votes).to.equal(-1)
          })
      })
      it("A8-PUT responds 201 when incrementing vote up", () => {
        return request.put(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(202)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("created_at", "votes", "belongs_to", "created_by")
            expect(res.body.votes).to.equal(1)
          })
      })
      it("A7n8 Err-PUT responds 400 when incorrect input used", () => {
        return request.put(`/api/articles/mitch?vote=up`)
          .expect(400)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal(`The correct parameters for this request not met. See below for details`)
            expect(res.body.BAD_REQUEST).to.equal(`Your input of mitch is not appropriate to complete the search : The parameters REQUIRE a relevant 24digit hash`)
          })
      })
      it("A7n8.5 Err-PUT responds 404 when incorrect id hash from another collection", () => {
        return request.put(`/api/articles/${topicDocs[0]._id}?vote=up`)
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "NOT_FOUND")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.NOT_FOUND).to.equal(`Given Path or Field is invalid`)
          })
      })
      it('A9- POST responds with 201 for a correctly structured post', () => {
        const articleId = articleDocs[0]._id
        return request.post(`/api/articles/${articleId}/comments`)
          .send({
            votes: 0,
            body: 'Oh wow, I love to make inane useless comments',
            belongs_to: 'mitch'
          })
          .expect(201)
          .then(res => {
            expect(res.body.added).to.be.an("Object")
            expect(res.body.added).to.contain.keys("body", "created_by", "created_at", "belongs_to", "votes")
          })
      })
      it('A10- POST responds with 400 for an incorrectly structured post', () => {
        const articleId = articleDocs[0]._id
        return request.post(`/api/articles/${articleId}/comments`)
          .send({
            anything: 'blah blah blah'
          })
          .expect(400)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal(`The correct parameters for post request not met. See below for details`)
            expect(res.body.BAD_REQUEST).to.equal(`The following are REQUIRED for a successful post: body`)
          })
      })
    })
    describe("comments", () => {
      it("C1-PUT responds 201 when incrementing vote up or down", () => {
        return request.put(`/api/comments/${commentDocs[0]._id}?vote=up`)
          .expect(202)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("body", "created_by", "created_at", "belongs_to", "votes")
            expect(res.body.votes).to.equal(1)
            expect(res.body.body).to.equal("Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.")
          })
      })
      it("C1.5 Err-PUT responds 400 when incorrect input used", () => {
        return request.put(`/api/comments/mitch?vote=up`)
          .expect(400)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal(`The correct parameters for this request not met. See below for details`)
            expect(res.body.BAD_REQUEST).to.equal(`Your input of mitch is not appropriate to complete the search : The parameters REQUIRE a relevant 24digit hash`)
          })
      })
      it("C1.75 Err-PUT responds 404 when incorrect id hash from another collection", () => {
        return request.put(`/api/comments/${topicDocs[0]._id}?vote=up`)
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "NOT_FOUND")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.NOT_FOUND).to.equal(`Given Path or Field is invalid`)
          })
      })
      it("C2-DELETE responds 200 when deleting a comment", () => {
        return request.delete(`/api/comments/${commentDocs[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.have.contains.keys("deleted", "msg")
            expect(res.body.deleted).to.contain.keys("body", "created_by", "created_at", "belongs_to", "votes")
            expect(res.body.deleted.body).to.equal("Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.")
          })
      })
    })
    describe("users", () => {
      it("U1 - GET responds with a user and their known info", () => {
        return request.get(`/api/users/${userDocs[0].username}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body.user[0]).to.contain.keys("username", "avatar_url", "name")
            expect(res.body.user[0]._id).to.equal(`${userDocs[0]._id}`)
          })
      })
      it("U2 - GET responds with 400 when correct input used", () => {
        return request.get(`/api/users/butter`)
          .expect(400)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal(`The correct parameters for this request not met. See below for details`)
            expect(res.body.BAD_REQUEST).to.equal(`Your input of butter is not appropriate to complete the search : The parameters REQUIRE an existing username`)
          })
      })
      it("U3 - GET responds 404 when incorrect id hash from another collection", () => {
        return request.get(`/api/users/${topicDocs[0]._id}`)
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "NOT_FOUND")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.NOT_FOUND).to.equal(`Given Path or Field is invalid`)
          })
      })
    })
  })
})