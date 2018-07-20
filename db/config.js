const NODE_ENV = process.env.NODE_ENV || 'dev';


const config = {
  dev: {
    DB_URL: `mongodb://localhost:27017/northcoderNews`
  },
  test: {
    DB_URL: `mongodb://localhost:27017/northcoderNews`
  },
  production : {
    DB_URL: `mongodb://northcoder_news:lorry94@ds231941.mlab.com:31941/northcoder_news`
  }
}

module.exports = config[NODE_ENV]