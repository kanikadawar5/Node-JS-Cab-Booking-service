const responses = require('./../../responses/responses')
var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const services = require('./../services/admin-services')
const promise = require('bluebird')
const moment = require('moment')

exports.registerAdmin = promise.coroutine(function*(req, res) {
        try {
                let values = [req.body.username]
                let result = yield services.checkDuplicate(values)
                numberOfLoggedInAdmins = yield services.loggedAdminCheck(req.body)
                if (numberOfLoggedInAdmins < 2 && result[0].count<1) {
                        let hash = yield bcrypt.hash(req.body.password, constants.SALT_ROUNDS)
                        let payload = {
                                un: req.body.username,
                                pw: req.body.password
                        }
                        let token = jwt.sign(payload, constants.KEY, constants.SIGNOPTIONS)
                        console.log(hash)
                        let values = [
                                req.body.username,
                                hash,
                                "0",
                                req.body.first_name,
                                req.body.last_name,
                                req.body.phone_number,
                                req.body.email
                        ]
                        let result1 = yield services.registerAdmin(values)
                responses.sendResponse(res, "User registered succesfully", 200, values)
                }
        } catch (error) {
                responses.sendErrorResponse(res, "Could not send data", 400)
        }
})

exports.loginAdmin = promise.coroutine(function*(req, res) {
        try {
                let inDB = yield services.inDB(req.body)
                if (inDB.length == 0)
                        res.send(responses.sendResponse(res, "Register first", 400))
                const payload = {
                        un: req.body.username,
                        pw: req.body.password
                }
                let values1 = [req.body.username]
                let token = jwt.sign(payload, constants.KEY)
                console.log(token)
                let data = yield services.loginAdmin(values1, req.body.password)
                if (data && token)
                        res.send(responses.sendResponse(res, "User logged in succesfully", 200, data))
                else
                        res.send(responses.sendErrorResponse(res, "Invalid credentials", 400, req.body))
        } catch (error) {
                responses.sendErrorResponse(res, "Invalid credentials")
        }
})

exports.viewAllBookings = promise.coroutine(function*(req, res) {
        try {
                let decoded = yield jwtDecode(req.body.token)
        } catch (error) {
                res.send(responses.sendResponse(res, "Invalid token", 400))
        }
        console.log(req.body.token)
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let values = [
                "0",
                username
        ]
        try {
                let result = yield services.viewAllBookings(values, username)
                res.send(responses.sendResponse(res, "All bookings", 200, result))
        } catch (error) {
                res.send(responses.sendErrorResponse(res, "Unable to process the query", 400))
        }
})

exports.assignDriver = promise.coroutine(function*(req, res) {
        try {
                let decoded = yield jwtDecode(req.body.token)
                let checkDrivers = yield services.checkDrivers(decoded.un)
                let checkBookings = yield services.checkBookings(decoded.un)
                if (checkBookings > 0 && checkDrivers > 0) {
                        let decoded = jwtDecode(req.body.token)
                        let username = decoded.un
                        let result = yield services.assignDriver(username)
                        if (result)
                                res.send(responses.sendResponse(res, "Driver assigned", 200, result))
                } else {
                        res.send(responses.sendResponse(res, "All assigned", 400))
                }
        } catch (error) {
                res.send(responses.sendResponse(res, "Only admins can assign", 400))
        }
})