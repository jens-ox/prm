const knex = require('../../knex')
const tag = require('express').Router()

/**
 * GET /views/tag/:id: get all information needed to display detailed information on a tag
 *
 * Query params:
 * - id: id of the tag
 */
tag.get('/:id', async (req, res, next) => {
  const id = req.params.id

  // get base data for tag
  const tag = await knex('tag')
    .select('*')
    .where('id', id)
    .first()

  // calendar: get all diary entries using this tag
  const values = await knex('diaryHasTag')
    .select('diary.date')
    .count('* as count')
    .join('diary', 'diaryHasTag.diaryId', 'diary.id')
    .where('diaryHasTag.tagId', id)
    .groupBy('diary.date')

  res.json({
    ...tag, values
  })
})

/**
 * GET /views/tag/by-date/:date: get all diary entries for a given date
 *
 * Query params:
 * - date: date string (e.g. 2020-01-28)
 */
tag.get('/by-date/:date', async (req, res, next) => {
  const entries = await knex('diary').where('date', req.params.date)
  res.json(entries)
})

module.exports = tag
