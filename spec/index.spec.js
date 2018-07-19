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
      it("1-GET responds 200 and all topics", () => {
        return request.get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.result[0]).to.contain.keys("title", "slug")
            expect(res.body.result).to.be.an("Array")
            expect(res.body.result.length).to.equal(2)
          })
      })
      it("2-GET responds 404 when topics is misspelt", () => {
        return request.get("/api/topic")
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.BAD_REQUEST).to.equal(`Given Path or Field is invalid`)
          })
      })
      it("3-GET responds 200 and specific articles of given topic", () => {
        return request.get("/api/topics/mitch/articles")
          .expect(200)
          .then(res => {
            expect(res.body.result).to.be.an("Array")
            expect(res.body.result[0]).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes")
            expect(res.body.result.length).to.equal(2)
          })
      })
      it("4-GET responds 404 for a topic that does not exist", () => {
        return request.get("/api/topics/mich/articles")
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal(`Cannot read property 'slug' of undefined`)
            expect(res.body.BAD_REQUEST).to.equal(`Given topic is invalid`)
          })
      })
      it('5- POST responds with 400 for an incorrectly structured post', () => {
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
            expect(res.body.BAD_REQUEST).to.equal(`The following are REQUIRED for a succsessful post: created_by, belongs_to, body, title`)
          })
      })
      it('6- POST responds with 201 for a correctly structured post', () => {
        const topicId = topicDocs[0]._id
        return request.post(`/api/topics/${topicId}/articles`)
          .send({
            votes: 0,
            title: 'The Man, The Master, The Meme',
            created_by: '5b507350c6aab01c1f82121b',
            body: 'What a fine gentleman, and a scholar',
            belongs_to: 'mitch'
          })
          .expect(201)
          .then(res => {
            expect(res.body.result).to.be.an("Object")
            expect(res.body.result).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes")
          })
      })
    })
    describe("articles", () => {
      it("7-GET responds 200 and all articles", () => {
        return request.get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.result).to.be.an("Array")
            expect(res.body.result[0]).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes")
            expect(res.body.result.length).to.equal(4)
          })
      })
      it("8-GET responds 404 when articles is misspelt", () => {
        return request.get("/api/article")
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.BAD_REQUEST).to.equal(`Given Path or Field is invalid`)
          })
      })
      it("9-GET responds 200 when searching for articles by id", () => {
        return request.get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body.result).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes")
            expect(res.body.result.body).to.equal("I find this existence challenging")
          })
      })
      it("10-GET responds 404 when incorrect id hash from another collection", () => {
        return request.get(`/api/articles/${topicDocs[0]._id}`)
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.BAD_REQUEST).to.equal(`Given Path or Field is invalid`)
          })
      })
      it("11-GET responds 400 when incorrect input used", () => {
        return request.get(`/api/articles/mitch`)
          .expect(400)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal(`The correct parameters for this request not met. See below for details`)
            expect(res.body.BAD_REQUEST).to.equal(`Your input of mitch is not appropriate to complete the search : The parameters REQUIRE a relevant 24digit hash`)
          })
      })
      it("12-GET responds 200 when searching for comments by articles by id", () => {
        return request.get(`/api/articles/${articleDocs[0]._id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body.result).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes")
            expect(res.body.result.body).to.equal("I find this existence challenging")
          })
      })
      it("XXXX-PUT responds 201 when incrementing vote up or down", () => {
        return request.get(`/api/articles/${articleDocs[0]._id}?vote=down`)
          .expect(202)
          .then(res => {
            expect(res.body.result.votes).to.equal(-1)
            expect(res.body.result).to.be.an("Object")
            expect(res.body.result).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes")
          })
      })
      it("XXXX-PUT responds 201 when incrementing vote up or down", () => {
        return request.put(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(202)
          .then(res => {
            expect(res.body.result).to.be.an("Object")
            expect(res.body.result).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes")
            expect(res.body.result.votes).to.equal(1)
          })
      })
    })
    describe("comments", () => {
      it.only("XXXX-PUT responds 201 when incrementing vote up or down", () => {
        return request.get(`/api/comments/${commentDocs[0]._id}?vote=up`)
          .expect(202)
          .then(res => {
            expect(res.body.result).to.be.an("Object")
            expect(res.body.result).to.contain.keys("title", "body", "created_by", "created_at", "belongs_to", "votes")
            expect(res.body.result.votes).to.equal(1)
          })
      })
    })
  })
})