const express = require('express')
const router = express.Router()
const { uploadImage } = require('../controllers/imageController')
const { writeLimiter } = require('../middleware/rateLimiters')

router.post('/', writeLimiter, uploadImage)

module.exports = router