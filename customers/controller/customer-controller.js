var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const responses = require('./../../responses/responses')
const services = require('./../services/customer-services')

exports.registerCustomer = async (req, res) => {
        let hash = bcrypt.hashSync(req.body.password, constants.SALT_ROUNDS);
        let payload = {
                un: req.body.username,
                pw: req.body.password
        }
        let token = jwt.sign(payload, constants.KEY, constants.SIGNOPTIONS)
        console.log(token)
        let values = [
                req.body.username,
                hash,
                "1",
                req.body.first_name,
                req.body.last_name,
                req.body.phone_number,
                req.body.email
        ]
        let values1 = [req.body.username]
        let result = await services.registerCustomer(values)
        if (result.affectedRows = 0)
                res.send(responses.sendErrorResponse(res, "Send data correctly", 400, result))
        else
                res.send(responses.sendResponse(res, "Customer added succesfully", 200, values))
}

exports.loginCustomer = async (req, res) => {
        const payload = {
                un: req.body.username,
                pw: req.body.password
        }
        let token = jwt.sign(payload, constants.KEY)
        console.log(token)
        let values = [req.body.username]
        let result = await services.loginCustomer(values, req.body.password)
        if (token)
                res.send(responses.sendResponse(res, "User logged in succesfully", 200, result))
}

exports.createBooking = async (req, res) => {
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let password = decoded.pw
        let values = [username]
        let result = await services.createBooking(values, req.body, password, username)
        res.send(responses.sendResponse(res, "Booking created succesfully", 200, result))
}

exports.viewAllBookings = async (req, res) => {
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let values = [username]
        let result = await services.viewAllBookings(values)
        res.send(responses.sendResponse(res, "Viewing all bookings", 200, result))
}