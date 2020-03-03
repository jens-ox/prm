const sqlite = require('sqlite3')
const fs = require('fs')
const seed = require('./seed')

const path = './data/data.db'

module.exports = () => {
  // create database if necessary
  try {
    fs.accessSync(path, fs.F_OK)
    console.log('database can be accessed')
  } catch (error) {
    console.log('database not existing yet, creating')
    const database = new sqlite.Database(path,
      sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
      error => {
        if (error) {
          console.error(error)
          process.exit(1)
        }
      }
    )
    console.log(`created database ${database}`)
  }

  // initialize database
  seed()
}
