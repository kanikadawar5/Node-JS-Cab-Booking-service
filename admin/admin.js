const express = require('express')
const router = express.Router()
const validator = require('./validators/admin-validation')
const controller = require('./controller/admin-controller.js')

router.get('/register',validator.validateAdmin,controller.registerAdmin)
router.get('/login',validator.validateAdmin,controller.loginAdmin)
router.get('/viewAllBookings',controller.viewAllBookings)
router.get('/assignDriver',controller.assignDriver)

module.exports = router