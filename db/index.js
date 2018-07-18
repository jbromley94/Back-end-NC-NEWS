const {
  DB
} = require('./config.js')


const DB_URL = `mongodb://${DB.host}:${DB.port}/${DB.database}`

module.exports = {DB_URL}