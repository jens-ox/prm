const knex = require('../knex')
const people = require('express').Router()

/**
 * GET /: get users, limit 100
 *
 * Query params:
 * - offset: offset
 */
people.get('/', async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = 100

  const result = await knex
    .select('*')
    .from('person')
    .offset(offset)
    .limit(limit)
    .orderBy(['lastName', 'firstName'])
  res.json(result)
})

/**
 * POST /: create new person
 *
 * Body:
 * - firstName: string
 * - lastName: string
 * - relations: [{ personId, relationTypeId }]
 * - properties: [{ value, propertyTypeId }]
 */
people.post('/', async (req, res, next) => {
  console.log(req.body)
  const { relations = [], properties = [], notes = [], ...person } = req.body
  console.log('adding person: ', { person, relations, properties })

  // check that base parameters are set
  if (!person.firstName) return next(new Error('no first name set'))
  if (!person.lastName) return next(new Error('no last name set'))

  // insert person
  const result = await knex('person').insert(person)
  const personId = result[0]

  // create relations if necessary
  if (relations.length !== 0) {
    await knex('relatedTo').insert(relations.map(relation => ({
      firstPersonId: personId,
      secondPersonId: relation.personId,
      relationTypeId: relation.relationTypeId
    })))
  }

  // create properties if necessary
  if (properties.length > 0) {
    await knex('hasProperty').insert(properties.map(property => ({
      personId,
      value: property.value,
      propertyTypeId: property.propertyTypeId
    })))
  }

  // create notes if necessary
  if (notes.length > 0) {
    await knex('note').insert(notes.map(note => ({
      personId,
      ...note
    })))
  }

  // return
  res.json(personId)
})

people.get('/by-property-type/:type', async (req, res, next) => {
  // check required props
  if (!req.params.type) return next(new Error('no property type set'))
  const type = req.params.type

  // set optional props
  const limit = req.query.limit || -1

  const result = await knex
    .select('person.*')
    .from('hasProperty')
    .innerJoin('propertyType', 'hasProperty.propertyTypeId', 'propertyType.id')
    .innerJoin('person', 'hasProperty.personId', 'person.id')
    .where('propertyType.name', type)
    .modify(queryBuilder => {
      if (limit > 1) queryBuilder.limit(limit)
      else if (limit === 1) queryBuilder.first()
    })
  res.json(result)
})

people.get('/by-id/:id', async (req, res, next) => {
  // check required props
  if (!req.params.id) return next(new Error('no id specified'))
  const id = req.params.id

  // load data
  const result = await knex
    .select('*')
    .from('person')
    .where('id', id)
    .first()

  // check if person exists
  if (!result) return res.status(404).send('person not found')

  const propertyResult = await knex
    .select('hasProperty.id AS id', 'hasProperty.value AS value', 'propertyType.name AS name', 'propertyCategory.name AS category', 'propertyDataType.name AS type')
    .from('hasProperty')
    .join('propertyType', 'propertyType.id', 'hasProperty.propertyTypeId')
    .join('propertyCategory', 'propertyCategory.id', 'propertyType.propertyCategoryId')
    .join('propertyDataType', 'propertyDataType.id', 'propertyType.propertyDataTypeId')
    .where('hasProperty.personId', id)
  const relationResult = await knex
    .select(
      'person1.id AS firstPersonId',
      'person1.firstName AS firstPersonFirstName',
      'person1.lastName AS firstPersonLastName',
      'person2.id AS secondPersonId',
      'person2.firstName AS secondPersonFirstName',
      'person2.lastName AS secondPersonLastName',
      'relationType.name AS relationTypeName',
      'relationType.isBidirectional AS relationTypeBidirectional',
      'relationType.reverseName AS relationTypeReverseName',
      'relationCategory.name AS relationCategoryName',
      'relatedTo.value AS relationValue',
      'relatedTo.id AS id'
    )
    .from('relatedTo')
    .join('person AS person1', 'person1.id', 'relatedTo.firstPersonId')
    .join('person AS person2', 'person2.id', 'relatedTo.secondPersonId')
    .join('relationType', 'relatedTo.relationTypeId', 'relationType.id')
    .join('relationCategory', 'relationType.relationCategoryId', 'relationCategory.id')
    .where('person1.id', id)
    .orWhere('person2.id', id)
  const notesResult = await knex
    .select('*')
    .from('note')
    .where('personId', id)
  const data = {
    ...result,
    properties: propertyResult,
    relations: relationResult,
    notes: notesResult
  }
  res.json(data)
})

module.exports = people
