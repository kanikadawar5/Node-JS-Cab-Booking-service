const responses = require('./../../responses/responses')
var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const services = require('./../services/driver-services')
const promise = require('bluebird')

/**
 * @function <b>registerDriver</b><br>
 * @param {string(username)}
 * @param {alphanumeric(password)}
 * @param {string(first_name)}
 * @param {string(last_name)}
 * @param {number(phone_number)}
 * @param {string(email)}
 */

exports.registerDriver = promise.coroutine(function*(req, res) {
        try {
                let result1 = yield services.checkDuplicate(req.body.username)
                if (result1[0].count != 0)
                        responses.sendErrorResponse(res, "You are already registered", 400)
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
                        "2",
                        req.body.first_name,
                        req.body.last_name,
                        req.body.phone_number,
                        req.body.email,
                        req.body.current_latitude,
                        req.body.current_longitude
                ]
                let result = yield services.registerDriver(values, req.body.username, req.body)
                if (result)
                        res.send(responses.sendResponse(res, "Driver added succesfully", 200, req.body))
        } catch (error) {
                responses.sendErrorResponse(res, "Could not send data", 400)

        }
})

/**
 * @function <b>loginDriver</b><br>
 * @param {string(username)}
 * @param {alphanumeric(password)}
 */

exports.loginDriver = promise.coroutine(function*(req, res) {
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
                let values = [req.body.username, req.body.username]
                let result = yield services.loginDriver(values, req.body.password)
                if (token && result)
                        res.send(responses.sendResponse(res, "User logged in succesfully", 200, result))
        } catch (error) {
                res.send(responses.sendResponse(res, "Error logging in", 400))
        }
})

/**
 * @function <b>completeBooking</b><br>
 * Completes bookings for the logged in driver
 * @param {string(token)}
 */

exports.completeBooking = promise.coroutine(function*(req, res) {
        try {
                try {
                        let decoded = jwtDecode(req.body.token)
                } catch (error) {
                        res.send(responses.sendResponse(res, "Invalid token", 400))
                }
                let decoded = jwtDecode(req.body.token)
                let username = decoded.un
                let password = decoded.pw
                let booking_id = req.body.booking_id
                let values = [booking_id, username]
                let result = yield services.completeBooking(values, username)
                res.send(responses.sendResponse(res, "Booking completed succesfully", 200, result))
        } catch (error) {
                res.send(responses.sendResponse(res, "Unable to process the query", 400))
        }
})

/**
 * @function <b>viewAllBookings</b><br>
 * Creates all bookings for the logged in driver
 * @param {string(token)}
 */

exports.viewAllBookings = promise.coroutine(function*(req, res) {
        try {
                let decoded = jwtDecode(req.body.token)
                let username = decoded.un
                let values = [username]
                let result = yield services.viewAllBookings(values)
                res.send(responses.sendResponse(res, "Viewing all bookings", 200, result))
        } catch (error) {
                res.send(responses.sendResponse(res, "Invalid token", 400))
        }
})

/**
 * @function <b>viewAssignedBookings</b><br>
 * Creates all the bookings assigned to the logged in customer
 * @param {string(token)}
 */

exports.viewAssignedBookings = promise.coroutine(function*(req, res) {
        try {
                let decoded = jwtDecode(req.body.token)
                let username = decoded.un
                let values = [username]
                let result = yield services.viewAssignedBookings(values)
                res.send(responses.sendResponse(res, "Viewing assigning bookings", 200, result))
        } catch (error) {
                res.send(responses.sendResponse(res, "Invalid token ", 400))

        }
})