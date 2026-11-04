const express = require('express')
const router = express.Router()
const { createService, getAllServices, getServiceBySlug, getBookmarks, updateServiceBySlug, deleteServiceBySlug, getSearchMatches } = require('../controllers/serviceController')
const { readLimiter, writeLimiter } = require('../middleware/rateLimiters')

//CREATE
router.post('/', writeLimiter, createService)
//READ
router.get('/all', readLimiter, getAllServices)
router.get('/search/:query', readLimiter, getSearchMatches)
router.post('/bookmarks', readLimiter, getBookmarks) // POST so the bookmark list can go in the body, but it's a read
router.get('/:slug', readLimiter, getServiceBySlug)
//UPDATE
router.put('/:slug', writeLimiter, updateServiceBySlug)
//DELETE
router.delete('/:slug', writeLimiter, deleteServiceBySlug)

module.exports = router