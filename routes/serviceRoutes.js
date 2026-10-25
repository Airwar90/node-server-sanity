const express = require('express')
const router = express.Router()
const { createService, getAllServices, getServiceBySlug, updateServiceBySlug, deleteServiceBySlug, getSearchMatches } = require('../controllers/serviceController')

//CREATE
router.post('/', createService)
//READ
router.get('/', getAllServices)
router.get('/search/:query', getSearchMatches)
router.get('/:slug', getServiceBySlug)
//UPDATE
router.put('/:slug', updateServiceBySlug)
//DELETE
router.delete('/:slug', deleteServiceBySlug)

module.exports = router