const express = require('express')
const router = express.Router()
const { requireUser, requireServiceOwner } = require('../middleware/authMiddleware')
const { createService, getAllServices, getServiceBySlug, getBookmarks, updateServiceBySlug, deleteServiceBySlug, getSearchMatches } = require('../controllers/serviceController')

//CREATE
router.post('/', requireUser, createService)
//READ
router.get('/all', getAllServices)
router.get('/search/:query', getSearchMatches)
router.post('/bookmarks', getBookmarks)
router.get('/:slug', getServiceBySlug)
//UPDATE
router.put('/:slug', requireUser, requireServiceOwner, updateServiceBySlug)
//DELETE
router.delete('/:slug', requireUser, requireServiceOwner, deleteServiceBySlug)

module.exports = router