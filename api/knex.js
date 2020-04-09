module.exports = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: require('./config').dbPath
  },
  useNullAsDefault: true
})
