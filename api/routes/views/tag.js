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
 * GET /views/tag/:id/by-date/:date: get all diary entries for a given date
 *
 * Query params:
 * - id: tag id
 * - date: date string (e.g. 2020-01-28)
 */
tag.get('/:id/by-date/:date', async (req, res, next) => {
  const entries = await knex('diaryHasTag')
    .select('diary.*')
    .join('diary', 'diaryHasTag.diaryId', 'diary.id')
    .where('date', req.params.date)
    .andWhere('tagId', parseInt(req.params.id))
  res.json(entries)
})

module.exports = tag
