const knex = require('../../knex')
const relation = require('express').Router()

relation.get('/:id', async (req, res, next) => {
  const id = req.params.id

  // base data
  const relation = await knex('relatedTo')
    .select('*')
    .where('id', id)
    .first()

  // people
  const firstPerson = await knex('person').select('*').where('id', relation.firstPersonId).first()
  const secondPerson = await knex('person').select('*').where('id', relation.secondPersonId).first()

  // relation type
  const relationType = await knex('relationType')
    .select('*')
    .where('id', relation.relationTypeId)
    .first()

  res.json({
    ...relation,
    firstPerson,
    secondPerson,
    relationType
  })
})

module.exports = relation
