const components = require('express').Router()

components.use('/property', require('./property'))
components.use('/relation', require('./relation'))
components.use('/add-property', require('./addProperty'))
components.use('/add-relation', require('./addRelation'))

module.exports = components
