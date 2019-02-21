const express = require('express')
const router = express.Router()
const validator = require('./validators/admin-validation')
const controller = require('./controller/admin-controller.js')

router.post('/register',validator.validateAdmin,controller.registerAdmin)
router.post('/login',validator.validateAdmin,controller.loginAdmin)
router.post('/viewAllBookings',controller.viewAllBookings)
router.post('/assignDriver',controller.assignDriver)

module.exports = router