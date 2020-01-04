const views = require('express').Router()

views.use('/person', require('./person'))

module.exports = views
