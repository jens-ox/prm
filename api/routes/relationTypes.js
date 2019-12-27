const knex = require('../knex')
const relationTypes = require('express').Router()

/**
 * GET /: get relationTypes, limit 100
 *
 * Query params:
 * - offset: offset
 */
relationTypes.get('/', async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('relationType.*', 'relationCategory.name AS categoryName')
    .from('relationType')
    .join('relationCategory', 'relationType.relationCategoryId', 'relationCategory.id')
    .offset(offset)
    .limit(limit)
  res.json(result)
})

/**
 * POST /: create new relationType
 *
 * Body:
 * - name: string
 * - isBidirectional: boolean
 * - reverseName: string
 * - relationCategoryId: integer
 */
relationTypes.post('/', async (req, res, next) => {
  const { name, reverseName = '', isBidirectional = false, relationCategoryId } = req.body

  // check that base parameters are set
  if (!name) return next(new Error('no name set'))

  // insert relation type
  const result = await knex('relationType').insert({ name, reverseName, isBidirectional, relationCategoryId })
  const id = result[0]

  // return
  res.json({ id, name, reverseName, isBidirectional, relationCategoryId })
})

module.exports = relationTypes
