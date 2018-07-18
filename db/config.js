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
// const test = {
//   DB: {
//     host: 'localhost',
//     port: 5432,
//     database: 'game_of_sql_test',
//     username: 'jordan',
//     password: 'Pa$$w0rd'
//   }
// }
const config = {
  dev
}

module.exports = config[NODE_ENV]