const express = require('express')
const router = express.Router()
const validator = require('./validators/admin-validation')
const controller = require('./controller/admin-controller.js')

router.post('/register',validator.validateAdmin,controller.registerAdmin)
router.post('/login',validator.validateAdmin,controller.loginAdmin)
router.get('/viewAllBookings',controller.viewAllBookings)
router.get('/assignDriver',controller.assignDriver)

module.exports = router