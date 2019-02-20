const express = require('express')
const router = express.Router()
const validator = require('./validators/customer-validation')
const controller = require('./controller/customer-controller.js')

router.get('/register',validator.validateCustomer,controller.registerCustomer)
router.get('/login',validator.validateCustomer,controller.loginCustomer)
router.get('/createBooking',controller.createBooking)

module.exports = router