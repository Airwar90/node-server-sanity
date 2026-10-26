const express = require('express')
const router = express.Router()
const { getInfo } = require('../controllers/infoController')

router.get('/:page', getInfo)

module.exports = router