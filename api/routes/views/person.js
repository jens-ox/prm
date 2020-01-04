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

  res.json({
    ...person,
    properties: properties.map(d => d.id),
    relations: relations.map(d => d.id),
    notes: notes.map(d => d.id),
    diaries: diaryEntries.map(d => d.id)
  })
})

module.exports = person
