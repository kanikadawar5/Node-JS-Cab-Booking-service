const responses = require('./../../responses/responses')
var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const services = require('./../services/driver-services')

exports.registerDriver = async (req, res) => {
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
        let result = await services.registerDriver(values, req.body.username, req.body)
        if (result.affectedRows == 0)
                res.send(responses.sendErrorResponse(res, "Send data correctly", 400, result))
        else
                res.send(responses.sendResponse(res, "Driver added succesfully", 200, req.body))
}

exports.loginDriver = async (req, res) => {
        const payload = {
                un: req.body.username,
                pw: req.body.password
        }
        let token = jwt.sign(payload, constants.KEY)
        console.log(token)
        let values = [req.body.username, req.body.username]
        let result = await services.loginDriver(values, req.body.password)
        if (token && result)
                res.send(responses.sendResponse(res, "User logged in succesfully", 200, result))
}

exports.completeBooking = async (req, res) => {
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let password = decoded.pw
        let booking_id = req.body.booking_id
        let values = [booking_id, username]
        let result = await services.completeBooking(values, req.body, password, username)
        // if(result)
        // res.send(responses.sendErrorResponse(res,"Error occured while updation",400))
        // else
        res.send(responses.sendResponse(res, "Booking completed succesfully", 200, result))
}

exports.viewAllBookings = async (req, res) => {
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let values = [username]
        let result = await services.viewAllBookings(values)
        res.send(responses.sendResponse(res, "Viewing all bookings", 200, result))
}

exports.viewAssignedBookings = async (req, res) => {
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let values = [username]
        let result = await services.viewAssignedBookings(values)
        res.send(responses.sendResponse(res, "Viewing assigning bookings", 200, result))
}