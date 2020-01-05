const knex = require('../../knex')
const addRelation = require('express').Router()

/**
 * GET /: get relationTypes, limit 100
 *
 * Query params:
 * - offset: offset
 */
addRelation.get('/relation-types', async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('relationType.*', 'relationCategory.name AS categoryName')
    .from('relationType')
    .join('relationCategory', 'relationType.relationCategoryId', 'relationCategory.id')
    .offset(offset)
    .limit(limit)

  console.log('relation types: ', result)
  res.json(result)
})

module.exports = addRelation
