const knex = require('../knex')
const notes = require('express').Router()

const extractMentions = async (diaryObject, mentionArray) => {
  console.log('parsing diary object: ', diaryObject)
  if (!diaryObject.content) return
  diaryObject.content.forEach(innerObject => {
    if (innerObject.type === 'mention') {
      mentionArray.push(innerObject.attrs.id)
    } else {
      extractMentions(innerObject, mentionArray)
    }
  })
}

/**
 * GET /: get diary entries, limit 100
 *
 * Query params:
 * - offset: offset
 */
notes.get('/', async (req, res) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('*')
    .from('diary')
    .orderBy('date', 'desc')
    .offset(offset)
    .limit(limit)
  res.json(result)
})

/**
 * POST /: create new diary entry
 *
 * Body:
 * - json: json-formatted diary entry
 * - date: diary date
 */
notes.post('/', async (req, res, next) => {
  let { json, date } = req.body

  // check that base parameters are set
  if (!json) return next(new Error('no json set'))
  if (!date) date = new Date().toISOString().split('T')[0]
  const text = JSON.stringify(json)
  console.log('json: ', text)
  console.log('date: ', date)

  // extract mentions
  // TODO this needs to be refactored when different things (like places) can be mentioned
  const mentionArray = []
  await extractMentions(json, mentionArray)
  console.log('mentions: ', mentionArray)

  // insert new diary entry
  const result = await knex('diary').insert({ text, date })
  const id = result[0]

  // insert mentions
  mentionArray.forEach(async personId => {
    await knex('mentioned').insert({
      diaryId: id,
      personId
    })
  })

  // return new diary entry
  res.json({ id, text, date })
})

/**
 * DELETE /:id: delete diary entry with id
 */
notes.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id set'))

  const result = await knex('diary').where('id', id).del()

  res.json(result)
})

module.exports = notes
