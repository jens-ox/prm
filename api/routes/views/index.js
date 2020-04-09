const views = require('express').Router()

views.use('/person', require('./person'))
views.use('/diary-entry', require('./diaryEntry'))
views.use('/tag', require('./tag'))
views.use('/edit-person', require('./editPerson'))

module.exports = views
