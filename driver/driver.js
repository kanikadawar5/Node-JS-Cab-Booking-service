const express = require('express')
const router = express.Router()
const validator = require('./validators/driver-validation')
const controller = require('./controller/driver-controller.js')

router.post('/register',validator.validateDriver,controller.registerDriver)
router.post('/login',validator.validateDriver,controller.loginDriver)
router.post('/viewAllBookings',controller.viewAllBookings)
router.post('/completeBooking',controller.completeBooking)
router.post('/viewAssignedBookings',controller.viewAssignedBookings)

module.exports = router