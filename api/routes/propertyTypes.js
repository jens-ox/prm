const knex = require('../knex')
const propertyTypes = require('express').Router()

/**
 * GET /: get propertyTypes, limit 100
 *
 * Query params:
 * - offset: offset
 */
propertyTypes.get('/', async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('propertyType.*', 'propertyCategory.name AS categoryName', 'propertyDataType.name AS dataType')
    .from('propertyType')
    .join('propertyCategory', 'propertyType.propertyCategoryId', 'propertyCategory.id')
    .join('propertyDataType', 'propertyType.propertyDataTypeId', 'propertyDataType.id')
    .offset(offset)
    .limit(limit)
  res.json(result)
})

/**
 * POST /: create new propertyType
 *
 * Body:
 * - name: string
 * - propertyCategoryId: integer
 */
propertyTypes.post('/', async (req, res, next) => {
  const { name, propertyCategoryId, propertyDataTypeId } = req.body

  // check that base parameters are set
  if (!name) return next(new Error('no name set'))

  console.log(name, propertyCategoryId)

  // insert property type
  const result = await knex('propertyType').insert({ name, propertyCategoryId, propertyDataTypeId })
  const id = result[0]

  // return
  res.json({ id, name, propertyCategoryId, propertyDataTypeId })
})

module.exports = propertyTypes
