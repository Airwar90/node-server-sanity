const express = require('express')
const router = express.Router()
const { getInfo } = require('../controllers/infoController')
const { readLimiter } = require('../middleware/rateLimiters')

router.get('/:page', readLimiter, getInfo)

module.exports = router