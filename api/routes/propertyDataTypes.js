const knex = require('../knex')
const propertyDataTypes = require('express').Router()

/**
 * GET /: get propertyDataTypes, limit 100
 *
 * Query params:
 * - offset: offset
 */
propertyDataTypes.get('/', async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('*')
    .from('propertyDataType')
    .offset(offset)
    .limit(limit)
  res.json(result)
})

module.exports = propertyDataTypes
