const knex = require('../knex')
const relations = require('express').Router()

/**
 * POST /: create new relation
 *
 * Body:
 * - value: string
 * - firstPersonId: integer
 * - secondPersonId: integer
 * - relationTypeId: integer
 */
relations.post('/', async (req, res, next) => {
  const { value = '', firstPersonId, secondPersonId, relationTypeId } = req.body

  // check that base parameters are set
  if (!firstPersonId) return next(new Error('no firstPersonId set'))
  if (!secondPersonId) return next(new Error('no secondPersonId set'))
  if (!relationTypeId) return next(new Error('no relationTypeId set'))

  // insert property
  const result = await knex('relatedTo').insert({ firstPersonId, secondPersonId, value, relationTypeId })
  const id = result[0]

  // return
  res.json({ id, value, firstPersonId, secondPersonId, relationTypeId })
})

relations.get('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no relation id set'))

  // get relation from database and return it
  const result = await knex('relatedTo').where('id', id).first()
  res.json(result)
})

/**
 * DELETE /:id: delete relation with id
 */
relations.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id set'))

  const result = await knex('relatedTo').where('id', id).del()

  res.json(result)
})

module.exports = relations
