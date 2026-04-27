const express = require('express')
const router = express.Router()
const { createLocation } = require('../controllers/locationController')

router.post('/', createLocation)

module.exports = router