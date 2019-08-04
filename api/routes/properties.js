const knex = require('../knex')
const properties = require('express').Router()

/**
 * POST /: create new property
 *
 * Body:
 * - value: string
 * - personId: integer
 * - propertyTypeId: integer
 */
properties.post('/', async (req, res, next) => {
  const { value, personId, propertyTypeId } = req.body

  // check that base parameters are set
  if (!value) return next(new Error('no value set'))
  if (!personId) return next(new Error('no personId set'))
  if (!propertyTypeId) return next(new Error('no propertyTypeId set'))

  // insert property
  const result = await knex('hasProperty').insert({ value, personId, propertyTypeId })
  const hasPropertyId = result[0]

  // return
  res.json(hasPropertyId)
})

module.exports = properties
