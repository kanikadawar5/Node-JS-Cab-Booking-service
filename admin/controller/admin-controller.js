const responses = require('./../../responses/responses')
var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const services = require('./../services/admin-services')

exports.registerAdmin = async (req, res) => {
        let numberOfLoggedInAdmins = services.loggedAdminCheck(req.body)
        if (numberOfLoggedInAdmins < 2) {
                var hash = bcrypt.hashSync(req.body.password, constants.SALT_ROUNDS);
                let payload = {
                        un: req.body.username,
                        pw: req.body.password
                }
                let token = jwt.sign(payload, constants.KEY, constants.SIGNOPTIONS)
                let values = [
                        req.body.username,
                        hash,
                        "0",
                        req.body.first_name,
                        req.body.last_name,
                        req.body.phone_number,
                        req.body.email,
                        token
                ]
                let result = await services.registerAdmin(values)
                res.send(responses.sendResponse(res, "User registered succesfully", 200, values))
        } else
                res.send(responses.sendErrorResponse(res, "Already two admins", 400, req.body))
}

exports.loginAdmin = async (req, res) => {
        const payload = {
                un: req.body.username,
                pw: req.body.password
        }
        let values1 = [req.body.username]
        let token = jwt.sign(payload, constants.KEY)
        console.log(token)
        let data = await services.loginAdmin(values1, req.body.password)
        if (data && token)
                res.send(responses.sendResponse(res, "User logged in succesfully", 200, data))
        else
                res.send(responses.sendErrorResponse(res, "Invalid credentials", 400, req.body))
}

exports.viewAllBookings = async (req, res) => {
        console.log(req.body.token)
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let values = [
                "0",
                username
        ]
        let result = await services.viewAllBookings(values, username)
        if (result)
                res.send(responses.sendResponse(res, "All bookings", 200, result))
        else
                res.send(responses.sendErrorResponse(res, "Some error occured", 400, req.body))
}

exports.assignDriver = async (req, res) => {
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let result = await services.assignDriver(username)
        if (result)
                res.send(responses.sendResponse(res, "Driver assigned", 200, result))
        else
                res.send(responses.sendResponse(res, "Only admins can assign", 400, result))
}