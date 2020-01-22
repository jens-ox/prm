const knex = require('../knex')
const diary = require('express').Router()

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
diary.get('/', async (req, res) => {
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
 * - text: json-formatted diary entry
 * - date: diary date
 */
diary.post('/', async (req, res, next) => {
  let { text, date } = req.body

  // check that base parameters are set
  if (!text) return next(new Error('no json set'))
  if (!date) date = new Date().toISOString().split('T')[0]
  if (typeof text !== 'string') text = JSON.stringify(text)
  console.log('json: ', text)
  console.log('date: ', date)

  // extract mentions
  // TODO this needs to be refactored when different things (like places) can be mentioned
  const mentionArray = []
  await extractMentions(text, mentionArray)
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

diary.get('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id set'))

  const result = await knex('diary').select('*').where('id', id).first()
  res.json(result)
})

diary.put('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id set'))
  const updateObject = {}
  const { text, date } = req.body
  if (text) {
    updateObject.text = typeof text === 'string' ? text : JSON.stringify(text)
  }
  if (date) updateObject.date = date

  await knex('diary').where('id', id).update(updateObject)

  // remove and re-compute mentions
  await knex('mentioned').where('diaryId', id).del()

  const mentionArray = []
  await extractMentions(text, mentionArray)
  mentionArray.forEach(async personId => {
    await knex('mentioned').insert({
      diaryId: id,
      personId
    })
  })

  res.json({
    id,
    ...updateObject
  })
})

/**
 * DELETE /:id: delete diary entry with id
 */
diary.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id) return next(new Error('no id set'))

  const result = await knex('diary').where('id', id).del()

  res.json(result)
})

/**
 * GET /search/:term: search diary entry
 */
diary.get('/search/:term', async (req, res, next) => {
  const term = req.params.term
  const result = await knex('diary').where('text', 'like', `%${term}%`)
  res.json(result)
})

module.exports = diary
