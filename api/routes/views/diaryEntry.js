const knex = require('../../knex')
const diaryEntry = require('express').Router()

diaryEntry.post('/:id/add-tag', async (req, res, next) => {
  const diaryId = req.params.id
  const { id: tagId } = req.body

  await knex('diaryHasTag').insert({ diaryId, tagId })
  res.json({})
})

diaryEntry.get('/:id/tags', async (req, res, next) => {
  const diaryId = req.params.id
  const tags = await knex('diaryHasTag')
    .select('tag.*')
    .join('tag', 'tag.id', 'diaryHasTag.tagId')
    .where('diaryHasTag.diaryId', diaryId)
  res.json(tags)
})

diaryEntry.delete('/:id/tags', async (req, res, next) => {
  const diaryId = req.params.id
  await knex('diaryHasTag').where('diaryId', diaryId).del()
  res.json({})
})

module.exports = diaryEntry
