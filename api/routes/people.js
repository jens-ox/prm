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
  console.log(req.body)
  const { firstName, lastName } = req.body
  console.log('adding person: ', { firstName, lastName })

  // check that base parameters are set
  if (!firstName) return next(new Error('no first name set'))
  if (!lastName) return next(new Error('no last name set'))

  // insert person
  const result = await knex('person').insert({ firstName, lastName })
  const id = result[0]

  // return
  res.json({ id, firstName, lastName })
})

module.exports = people
