# jb-northcoder-news

## Getting Started

Hello,
You have made it to the README for my app - [jb-northcoder-news](https://jb-northcoder-news.herokuapp.com/).
This API traverses the API through inputted routes. The API is fairly responsive in that for incorrect input you shall be met with an error message which not only informs you of an error having occurred but also why, and how to rectify the issue.

### Installing

To acquire the files you shall have to use this snippet in the command line, make sure that you hade cd into the directory you wish to clone into :

```
git clone https://github.com/jbromley94/BE-FT-northcoders-news.git
```

Below lays out the npm installs one shall have to use to get the app up and running.

### Prerequisites

To use this program you will have to run the following, this is provided you have set up your npm and git environments.

For all npm packages needed just run : 

```
npm install
```

The versions are as follows :

```
    node : 9.9.0
    body-parser: 1.18.3
    ejs: 2.6.1
    express: 4.16.3
    mongoose: 5.2.4
    chai: 4.1.2
    mocha: 5.2.0
    nodemon: 1.18.3
    supertest: 3.1.0
```

The final task to carry out will be to navigate to the folder db, and create a config.js file. You can do this using either vscode to make a new file or by cd-ing into the db folder and typing

```
touch config.js
```

Once that has been performed it is time to set up your config file. You can use this template of code provided:

```
const NODE_ENV = process.env.NODE_ENV || 'dev';


const config = {
  dev: {
    DB_URL: `mongodb://localhost:27017/<your database here>`
  },
  test: {
    DB_URL: `mongodb://localhost:27017>/<your database here>`
  },
  production : {
    DB_URL: `mongodb://<name of database hosted through mlabs>:<password for that database>@ds231941.mlab.com:31941/<your database name again>`
  }
}

module.exports = config[NODE_ENV]
```

A brief overview of this is that the dev and test run locally whilst the production level code points to the mlabs database.

You should now be completely up and running hopefully.

## Running the tests

Before any tests are attempted, or any seeding at all, it is paramount to note that in your favourite terminal application to type and enter : 

```
mongod
```

To run the test you can run the scripts given in the provided package.json file.
Likewise feel free to produce your own.
The easiest way is to use :

```
npm test
```

### Break down into end to end tests

The tests are relatively self explanatory.
There is a test for each request and its routes. This reaches into the territory of also testing for errors. So feel assured the product is fairly robust.

One of the smaller examples is listed below:

```
it("A2-GET responds 404 when articles is misspelt", () => {
        return request.get("/api/article")
          .expect(404)
          .then(res => {
            expect(res.body).to.be.an("Object")
            expect(res.body).to.contain.keys("msg", "BAD_REQUEST")
            expect(res.body.msg).to.equal('These are not the droids you\'re looking for')
            expect(res.body.BAD_REQUEST).to.equal(`Given Path or Field is invalid`)
          })
      })
```

The lettering is a direct reference to pathway, in this case /articles. The number correlates to the position of which test it is.

### And coding style tests

As seen above the test aims to test the reponse in terms of its body and not just simpler aspects as in - is "Object".
It was also important I tested the actual response on the value of the objects keys.

## Built With

- [mongoose](http://mongoosejs.com/docs/)
- [express](https://expressjs.com/)
- [ejs](http://www.embeddedjs.com/)

## Authors

- **Jordan Bromley** - [My Github](https://github.com/jbromley94)

## Acknowledgments

- Thanks to northcoders
