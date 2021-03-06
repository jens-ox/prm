const knex = require('../knex')
const people = require('express').Router()

/**
 * GET /: get users, limit 100
 *
 * Query params:
 * - offset: offset
 */
people.get('/', async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('*')
    .from('person')
    .offset(offset)
    .limit(limit)
    .orderBy(['lastName', 'firstName'])
  res.json(result)
})

/**
 * POST /: create new person
 *
 * Body:
 * - firstName: string
 * - lastName: string
 */
people.post('/', async (req, res, next) => {
  const { firstName, lastName } = req.body

  // check that base parameters are set
  if (!firstName) return next(new Error('no first name set'))
  if (!lastName) return next(new Error('no last name set'))

  // insert person
  const result = await knex('person').insert({ firstName, lastName })
  const id = result[0]

  // return
  res.json({ id, firstName, lastName })
})

/**
 * DELETE /people/:id: delete a person and all related data
 *
 * Query params:
 * - id: person id
 */
people.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id specified'))

  // delete mentions
  await knex('mentioned').where('personId', id).del()

  // delete notes
  await knex('note').where('personId', id).del()

  // delete relations
  await knex('relatedTo').where('firstPersonId', id).orWhere('secondPersonId', id).del()

  // finally, delete person
  await knex('person').where('id', id).del()

  res.json({})
})

module.exports = people
