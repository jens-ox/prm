const knex = require('../../knex')
const person = require('express').Router()

person.get('/:id', async (req, res, next) => {
  const id = req.params.id

  // get base data for person
  const person = await knex('person')
    .select('*')
    .where('id', id)
    .first()

  // properties
  const properties = await knex('hasProperty')
    .select('id')
    .where('personId', id)

  // relations
  const relations = await knex('relatedTo')
    .select('id')
    .where('firstPersonId', id)
    .orWhere('secondPersonId', id)

  // notes
  const notes = await knex('note')
    .select('id')
    .where('personId', id)
    .orderBy('timestamp', 'desc')

  // diary entries
  const diaryEntries = await knex('mentioned')
    .select('diary.id')
    .join('diary', 'diary.id', 'mentioned.diaryId')
    .where('personId', id)
    .orderBy('date', 'desc')

  //  diary entries for overview calendar
  const values = await knex('mentioned')
    .select('diary.date')
    .count('* as count')
    .join('diary', 'mentioned.diaryId', 'diary.id')
    .where('mentioned.personId', id)
    .groupBy('diary.date')

  res.json({
    person: {
      ...person,
      properties: properties.map(d => d.id),
      relations: relations.map(d => d.id),
      notes: notes.map(d => d.id),
      diaries: diaryEntries.map(d => d.id)
    },
    values
  })
})

/**
 * GET /views/person/:id/by-date/:date: get all diary entries for a given date
 *
 * Query params:
 * - id: person id
 * - date: date string (e.g. 2020-01-28)
 */
person.get('/:id/by-date/:date', async (req, res, next) => {
  const entries = await knex('mentioned')
    .select('diary.id')
    .join('diary', 'mentioned.diaryId', 'diary.id')
    .where('date', req.params.date)
    .andWhere('personId', parseInt(req.params.id))
  res.json(entries.map(entry => entry.id))
})
module.exports = person
