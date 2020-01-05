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
  const id = result[0]

  // return
  res.json({ id, value, personId, propertyTypeId })
})

properties.put('/:id', async (req, res, next) => {
  const { value, personId, propertyTypeId } = req.body
  const id = req.params.id

  const updateObject = {}
  if (value) updateObject.value = value
  if (personId) updateObject.personId = personId
  if (propertyTypeId) updateObject.propertyTypeId = propertyTypeId

  await knex('hasProperty').where('id', id).update(updateObject)

  res.json({ id, ...updateObject })
})

properties.get('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id set'))

  // get property from database and return it
  const result = await knex('hasProperty').where('id', id).first()
  res.json(result)
})
/**
 * DELETE /:id: delete property with id
 */
properties.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id set'))

  const result = await knex('hasProperty').where('id', id).del()

  res.json(result)
})

module.exports = properties
