const knex = require('../../knex')
const editPerson = require('express').Router()

/**
 * GET /edit-person/:id: get first and last name of person
 *
 * Query params:
 * - id: id of the person
 */
editPerson.get('/:id', async (req, res, next) => {
  const id = req.params.id

  const person = await knex('person').where('id', id).first()
  
  if (!person) return next(new Error('person not found'))

  res.json(person)
})

/**
 * PUT /edit-person/:id: update existing person
 *
 * Query params:
 * - id: id of the person
 */
editPerson.put('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id specified'))

  // get information
  let updateObject = {}
  if (req.body.lastName) updateObject.lastName = req.body.lastName
  if (req.body.firstName) updateObject.firstName = req.body.firstName

  await knex('person').where('id', id).update(updateObject)

  res.json({ ...updateObject, id })
})

module.exports = editPerson
