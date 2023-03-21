const express = require('express')
const router = express.Router()
const ApiController = require('../controllers/ApiController')

router.post('/insert-data', ApiController.insertData)
router.get('/get-user-data', ApiController.getDataUser)
router.post('/update-user-data', ApiController.updateDataUser)

module.exports = router
