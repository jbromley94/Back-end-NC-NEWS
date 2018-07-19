const NODE_ENV = process.env.NODE_ENV || 'dev';

const dev = {
  DB: {
    host: 'localhost',
    port: 27017,
    database: 'northcoderNews',
    username: 'jordan',
    password: 'Pa$$w0rd'
  }
}
const test = {
  DB: {
    host: 'localhost',
    port: 27017,
    database: 'northcoderNews',
    username: 'jordan',
    password: 'Pa$$w0rd'
  }
}
const config = {
  dev, test
}

module.exports = config[NODE_ENV]