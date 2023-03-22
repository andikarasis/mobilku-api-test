const express = require('express')
const router = express.Router()
const ApiController = require('../controllers/ApiController')

router.post('/insert-data', ApiController.insertData)
router.get('/get-user-data', ApiController.getDataUser)
router.put('/update-user-data', ApiController.updateDataUser)

router.post('/upload', ApiController.UploadFile)

module.exports = router
