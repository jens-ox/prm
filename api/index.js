const express = require('express')
const bodyParser = require('body-parser')
const initialize = require('./initialize')

const app = express()
const port = 3000

initialize()
app.listen(port, () => console.log(`PRM API on port ${port}!`))

// body handling
app.use(bodyParser.json())

// CORS
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

// routes
app.use('/people', require('./routes/people'))

// -- property related
app.use('/properties', require('./routes/properties'))
app.use('/property-types', require('./routes/propertyTypes'))
app.use('/property-data-types', require('./routes/propertyDataTypes'))
app.use('/property-categories', require('./routes/propertyCategories'))

// -- relation related
app.use('/relations', require('./routes/relations'))
app.use('/relation-types', require('./routes/relationTypes'))
app.use('/relation-categories', require('./routes/relationCategories'))

// -- notes
app.use('/notes', require('./routes/notes'))

// -- diary
app.use('/diary', require('./routes/diary'))
app.use('/tags', require('./routes/tags'))

// -- views
app.use('/views', require('./routes/views'))

// -- components
app.use('/components', require('./routes/components'))

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({
    message: err.message
  })
})
