const views = require('express').Router()

views.use('/person', require('./person'))
views.use('/diary-entry', require('./diaryEntry'))

module.exports = views
