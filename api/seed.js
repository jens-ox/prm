const knex = require('./knex')

module.exports = async () => {
  console.log('creating all database tables')

  // person
  const hasPerson = await knex.schema.hasTable('person')
  if (!hasPerson) {
    console.log('creating table person')
    await knex.schema.createTable('person', table => {
      table.increments('id')
      table.string('firstName')
      table.string('lastName')
    })
  }

  // note
  const hasNote = await knex.schema.hasTable('note')
  if (!hasNote) {
    console.log('creating table note')
    await knex.schema.createTable('note', table => {
      table.increments('id')
      table.text('text')
      table.bigInteger('timestamp')
      table.integer('personId').references('id').inTable('person')
    })
  }

  // relation category
  const hasRelationCategory = await knex.schema.hasTable('relationCategory')
  if (!hasRelationCategory) {
    console.log('creating table relationCategory')
    await knex.schema.createTable('relationCategory', table => {
      table.increments('id')
      table.string('name')
    })
  }

  // relation type
  const hasRelationType = await knex.schema.hasTable('relationType')
  if (!hasRelationType) {
    console.log('creating table relationType')
    await knex.schema.createTable('relationType', table => {
      table.increments('id')
      table.string('name')
      table.boolean('isBidirectional').defaultTo(true)
      table.string('reverseName').defaultTo('')
      table.integer('relationCategoryId').references('id').inTable('relationCategory')
    })
  }

  // related to
  const hasRelatedTo = await knex.schema.hasTable('relatedTo')
  if (!hasRelatedTo) {
    console.log('creating table relatedTo')
    await knex.schema.createTable('relatedTo', table => {
      table.bigIncrements('id')
      table.integer('firstPersonId').references('id').inTable('person')
      table.integer('secondPersonId').references('id').inTable('person')
      table.string('value')
      table.integer('relationTypeId').references('id').inTable('relationType')
    })
  }

  // property category
  const hasPropertyCategory = await knex.schema.hasTable('propertyCategory')
  if (!hasPropertyCategory) {
    console.log('creating table propertyCategory')
    await knex.schema.createTable('propertyCategory', table => {
      table.increments('id')
      table.string('name')
    })
  }

  // property data type
  const hasPropertyDataType = await knex.schema.hasTable('propertyDataType')
  if (!hasPropertyDataType) {
    console.log('creating table propertyDataType')
    await knex.schema.createTable('propertyDataType', table => {
      table.increments('id')
      table.string('name')
    })
  }

  // property type
  const hasPropertyType = await knex.schema.hasTable('propertyType')
  if (!hasPropertyType) {
    console.log('creating table propertyType')
    await knex.schema.createTable('propertyType', table => {
      table.increments('id')
      table.string('name')
      table.integer('propertyCategoryId').references('id').inTable('propertyCategory')
      table.integer('propertyDataTypeId').references('id').inTable('propertyDataType')
    })
  }

  // property values
  const hasPropertyValue = await knex.schema.hasTable('propertyValue')
  if (!hasPropertyValue) {
    console.log('creating table propertyValue')
    await knex.schema.createTable('propertyValue', table => {
      table.bigIncrements('id')
      table.string('value')
      table.integer('propertyTypeId').references('id').inTable('propertyType')
    })
  }

  // has property
  const hasHasProperty = await knex.schema.hasTable('hasProperty')
  if (!hasHasProperty) {
    console.log('creating table hasProperty')
    await knex.schema.createTable('hasProperty', table => {
      table.bigIncrements('id')
      table.text('value')
      table.integer('personId').references('id').inTable('person')
      table.integer('propertyTypeId').references('id').inTable('propertyType')
    })
  }

  // diary
  const hasDiary = await knex.schema.hasTable('diary')
  if (!hasDiary) {
    console.log('creating table diary')
    await knex.schema.createTable('diary', table => {
      table.bigIncrements('id')
      table.text('text')
      table.string('date')
    })
  }

  // tag
  const hasTag = await knex.schema.hasTable('tag')
  if (!hasTag) {
    console.log('creating table tag')
    await knex.schema.createTable('tag', table => {
      table.bigIncrements('id')
      table.text('text')
    })
  }

  // diaryHasTag
  const hasDiaryHasTag = await knex.schema.hasTable('diaryHasTag')
  if (!hasDiaryHasTag) {
    console.log('creating table diaryHasTag')
    await knex.schema.createTable('diaryHasTag', table => {
      table.bigInteger('diaryId').references('id').inTable('diary')
      table.bigInteger('tagId').references('id').inTable('tag')
    })
  }

  // mentioned
  const hasMentioned = await knex.schema.hasTable('mentioned')
  if (!hasMentioned) {
    console.log('creating table mentioned')
    await knex.schema.createTable('mentioned', table => {
      table.bigInteger('diaryId').references('id').inTable('diary')
      table.integer('personId').references('id').inTable('person')
    })
  }

  /**
   * Base Data
   * Here, the default data is seeded, if necessary
   */

  // string property data type
  const pdtString = await knex.select('id').from('propertyDataType').where('name', 'string')
  if (pdtString.length === 0) {
    console.log('pdt: creating string')
    await knex('propertyDataType').insert({ name: 'string' })
  }

  // date property data type
  const pdtDate = await knex.select('id').from('propertyDataType').where('name', 'date')
  let dateId
  if (pdtDate.length === 0) {
    console.log('pdt: creating date')
    const res = await knex('propertyDataType').insert({ name: 'date' })
    dateId = res[0]
  } else {
    dateId = pdtDate[0].id
  }

  // email property data type
  const pdtEmail = await knex.select('id').from('propertyDataType').where('name', 'email')
  if (pdtEmail.length === 0) {
    console.log('pdt: creating email')
    await knex('propertyDataType').insert({ name: 'email' })
  }

  // phone property data type
  const pdtPhone = await knex.select('id').from('propertyDataType').where('name', 'phone')
  if (pdtPhone.length === 0) {
    console.log('pdt: creating phone')
    await knex('propertyDataType').insert({ name: 'phone' })
  }

  // link property data type
  const pdtLink = await knex.select('id').from('propertyDataType').where('name', 'link')
  if (pdtLink.length === 0) {
    console.log('pdt: creating link')
    await knex('propertyDataType').insert({ name: 'link' })
  }

  // general property category
  const pcGeneral = await knex.select('id').from('propertyCategory').where('name', 'General')
  let generalId
  if (pcGeneral.length === 0) {
    console.log('pc: creating general')
    const res = await knex('propertyCategory').insert({ name: 'General' })
    generalId = res[0]
  } else {
    generalId = pcGeneral[0].id
  }

  // birthday property type
  const ptBirthday = await knex.select('id').from('propertyType').where('name', 'Birthday')
  if (ptBirthday.length === 0) {
    console.log('pt: creating birthday')
    await knex('propertyType').insert({
      name: 'Birthday',
      propertyCategoryId: generalId,
      propertyDataTypeId: dateId
    })
  }
}
