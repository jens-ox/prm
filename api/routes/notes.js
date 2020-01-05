const knex = require('../knex')
const notes = require('express').Router()

notes.get('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id set'))

  // get note from database and return it
  const result = await knex('note').where('id', id).first()
  res.json(result)
})

notes.put('/:id', async (req, res) => {
  const id = req.params.id
  const { personId, timestamp, text } = req.body
  const updateObject = {}
  if (personId) updateObject.personId = personId
  if (timestamp) updateObject.timestamp = timestamp
  if (text) updateObject.text = text

  await knex('note').where('id', id).update(updateObject)

  res.json({ id, ...updateObject })
})

/**
 * POST /: create new note
 *
 * Body:
 * - personId: integer
 * - timestamp: bigInteger
 * - text: text
 */
notes.post('/', async (req, res, next) => {
  let { personId, timestamp, text } = req.body

  // check that base parameters are set
  if (!personId) return next(new Error('no personId set'))
  if (!text) return next(new Error('no text set'))
  if (!timestamp) timestamp = Date.now()

  // insert note
  const result = await knex('note').insert({ personId, timestamp, text })
  const id = result[0]

  // return
  res.json({ id, text, timestamp, personId })
})

/**
 * DELETE /:id: delete note with id
 */
notes.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id set'))

  const result = await knex('note').where('id', id).del()

  res.json(result)
})

module.exports = notes
