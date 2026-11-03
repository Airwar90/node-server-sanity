const express = require('express')
const router = express.Router()
const { requireUser } = require('../middleware/authMiddleware')
const { uploadImage } = require('../controllers/imageController')

router.post('/', requireUser, uploadImage)

module.exports = router