var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const responses = require('./../../responses/responses')
const services = require('./../services/customer-services')
const promise = require('bluebird')
const moment = require('moment')
const jwtBlacklist = require('jwt-blacklist')(jwt)

/**
 * @function <b>registerCustomer</b><br>
 * @param {string(username)}
 * @param {alphanumeric(password)}
 * @param {string(first_name)}
 * @param {string(last_name)}
 * @param {number(phone_number)}
 * @param {string(email)}
 */

exports.registerCustomer = promise.coroutine(function*(req, res) {
        let values = [req.body.username]
        let result = yield services.checkDuplicate(values)
        let hash = bcrypt.hashSync(req.body.password, constants.SALT_ROUNDS);
        let payload = {
                un: req.body.username,
                pw: req.body.password
        }
        let token = jwt.sign(payload, constants.KEY, constants.SIGNOPTIONS)
        console.log(token)
        let values1 = [
                req.body.username,
                hash,
                "1",
                req.body.first_name,
                req.body.last_name,
                req.body.phone_number,
                req.body.email
        ]
        try {
                let result1 = yield services.registerCustomer(values1)
                if (result1)
                        responses.sendResponse(res, "Send data correctly", 200, result1)
        } catch (error) {
                responses.sendErrorResponse(res, "Could not send data", 400)
        }

})

/**
 * @function <b>loginCustomer</b><br>
 * @param {string(username)}
 * @param {alphanumeric(password)}
 */

exports.loginCustomer = promise.coroutine(function*(req, res) {
        try {
                let inDB = yield services.inDB(req.body)
                if (inDB.length == 0)
                        res.send(responses.sendResponse(res, "Register first", 400))
                const payload = {
                        un: req.body.username,
                        pw: req.body.password
                }
                let token = jwt.sign(payload, constants.KEY)
                console.log(token)
                let values = [req.body.username]
                let result = yield services.loginCustomer(values, req.body.password)
                if (token)
                        res.send(responses.sendResponse(res, "User logged in succesfully", 200, result))
        } catch (error) {
                res.send(responses.sendResponse(res, "Error logging in", 400))
        }
})

/**
 * @function <b>createBooking</b><br>
 * Creates bookings for the logged in customer
 * @param {string(token)}
 */

exports.createBooking = promise.coroutine(function*(req, res) {
        try {
                let decoded = jwtDecode(req.body.token)
        } catch (error) {
                res.send(responses.sendResponse(res, "Invalid token", 400))
        }
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let password = decoded.pw
        let values = [username]
        try {
                let result = yield services.createBooking(values, req.body, password, username)
                res.send(responses.sendResponse(res, "Booking created succesfully", 200, result))
        } catch (error) {
                res.send(responses.sendResponse(res, "Invalid token", 400))
        }
})

/**
 * @function <b>viewAllBookings</b><br>
 * Views all bookings for the logged in customer
 * @param {string(token)}
 */

exports.viewAllBookings = promise.coroutine(function*(req, res) {
        try {
                let decoded = jwtDecode(req.body.token)
        } catch (error) {
                res.send(responses.sendResponse(res, "Invalid token", 400))
        }
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let values = [username]
        let result = yield services.viewAllBookings(values)
        res.send(responses.sendResponse(res, "Viewing all bookings", 200, result))
})