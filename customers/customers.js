const express = require('express')
const router = express.Router()
const validator = require('./validators/customer-validation')
const controller = require('./controller/customer-controller.js')

router.post('/register',validator.validateCustomer,controller.registerCustomer)
router.post('/login',validator.validateCustomer,controller.loginCustomer)
router.get('/createBooking',controller.createBooking)
router.get('/viewAllBookings',controller.viewAllBookings)

module.exports = router