const components = require('express').Router()

components.use('/property', require('./property'))
components.use('/relation', require('./relation'))

module.exports = components
