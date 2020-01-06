const knex = require('../knex')
const tags = require('express').Router()

/**
 * GET /: get tags, limit 100
 *
 * Query params:
 * - offset: offset
 */
tags.get('/', async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('*')
    .from('tag')
    .offset(offset)
    .limit(limit)
  res.json(result)
})

/**
 * POST /: create new tag
 *
 * Body:
 * - text: string
 */
tags.post('/', async (req, res, next) => {
  const { text } = req.body

  // check that base parameters are set
  if (!text) return next(new Error('no name set'))

  // insert tag
  const result = await knex('tag').insert({ text })
  const id = result[0]

  // return
  res.json({ id, text })
})

module.exports = tags
