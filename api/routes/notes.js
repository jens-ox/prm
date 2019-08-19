const knex = require('../knex')
const notes = require('express').Router()

/**
 * GET /: get notes, limit 100
 *
 * Query params:
 * - offset: offset
 */
notes.get('/:id', async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('*')
    .from('note')
    .where('personId', req.params.id)
    .orderBy('timestamp', 'desc')
    .offset(offset)
    .limit(limit)
  res.json(result)
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
  const noteId = result[0]

  // return
  res.json(noteId)
})

module.exports = notes
