const knex = require('../knex')
const relationCategories = require('express').Router()

/**
 * GET /: get relationCategories, limit 100
 *
 * Query params:
 * - offset: offset
 */
relationCategories.get('/', async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('*')
    .from('relationCategory')
    .offset(offset)
    .limit(limit)
  res.json(result)
})

/**
 * POST /: create new relationCategory
 *
 * Body:
 * - name: string
 */
relationCategories.post('/', async (req, res, next) => {
  const { name } = req.body

  // check that base parameters are set
  if (!name) return next(new Error('no name set'))

  // insert relation category
  const result = await knex('relationCategory').insert({ name })
  const relationCategoryId = result[0]

  // return
  res.json(relationCategoryId)
})

module.exports = relationCategories
