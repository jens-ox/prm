const knex = require('../../knex')
const addProperty = require('express').Router()

/**
 * GET /: get propertyTypes, limit 100
 *
 * Query params:
 * - offset: offset
 */
addProperty.get('/property-types', async (req, res, next) => {
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

module.exports = addProperty
