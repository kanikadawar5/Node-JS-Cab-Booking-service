const express = require('express')
const router = express.Router()
const validator = require('./validators/driver-validation')
const controller = require('./controller/driver-controller.js')

router.post('/register',validator.validateDriver,controller.registerDriver)
router.post('/login',validator.validateDriver,controller.loginDriver)
router.get('/viewAllBookings',controller.viewAllBookings)
router.get('/completeBooking',controller.completeBooking)
router.get('/viewAssignedBookings',controller.viewAssignedBookings)

module.exports = router