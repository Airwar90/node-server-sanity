const express = require('express')
const router = express.Router()
const { createService, getAllServices, getServiceBySlug, getBookmarks, updateServiceBySlug, deleteServiceBySlug, getSearchMatches } = require('../controllers/serviceController')

//CREATE
router.post('/', createService)
//READ
router.get('/all', getAllServices)
router.get('/search/:query', getSearchMatches)
router.post('/bookmarks', getBookmarks)
router.get('/:slug', getServiceBySlug)
//UPDATE
router.put('/:slug', updateServiceBySlug)
//DELETE
router.delete('/:slug', deleteServiceBySlug)

module.exports = router