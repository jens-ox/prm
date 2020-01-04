const knex = require('../../knex')
const property = require('express').Router()

property.get('/:id', async (req, res, next) => {
  const id = req.params.id

  // get base data for property
  const property = await knex('hasProperty')
    .select('hasProperty.*', 'propertyType.name AS name', 'propertyDataType.name AS type')
    .join('propertyType', 'propertyType.id', 'hasProperty.propertyTypeId')
    .join('propertyDataType', 'propertyDataType.id', 'propertyType.propertyDataTypeId')
    .where('hasProperty.id', id)
    .first()

  res.json(property)
})

module.exports = property
