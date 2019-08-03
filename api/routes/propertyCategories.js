const knex = require('../knex')
const propertyCategories = require('express').Router()

/**
 * GET /: get propertyCategories, limit 100
 *
 * Query params:
 * - offset: offset
 */
propertyCategories.get('/', async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('*')
    .from('propertyCategory')
    .offset(offset)
    .limit(limit)
  res.json(result)
})

/**
 * POST /: create new propertyCategory
 *
 * Body:
 * - name: string
 */
propertyCategories.post('/', async (req, res, next) => {
  const { name } = req.body

  // check that base parameters are set
  if (!name) return next(new Error('no name set'))

  // insert property type
  const result = await knex('propertyCategory').insert({ name })
  const propertyCategoryId = result[0]

  // return
  res.json(propertyCategoryId)
})

module.exports = propertyCategories
