const express = require('express')
const router = express.Router()
const validator = require('./validators/customer-validation')
const controller = require('./controller/customer-controller.js')

router.post('/register',validator.validateCustomer,controller.registerCustomer)
router.post('/login',validator.validateCustomer,controller.loginCustomer)
router.post('/createBooking',controller.createBooking)
router.post('/viewAllBookings',controller.viewAllBookings)
// router.post('/logout',controller.logoutCustomer)

module.exports = router