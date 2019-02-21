const responses = require('./../../responses/responses')
var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const services = require('./../services/admin-services')
const promise = require('bluebird')
const moment = require('moment')

exports.registerAdmin = (req,res) => {
        //duplicacy
        // let numberOfLoggedInAdmins = await 
        services.loggedAdminCheck(req.body).then((numberOfLoggedInAdmins) => {
        if(numberOfLoggedInAdmins < 2){
                // let hash = bcrypt.hashSync(req.body.password, constants.SALT_ROUNDS); 
                bcrypt.hash(req.body.password, constants.SALT_ROUNDS).then((hash) =>{ 
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
                console.log(req.body)
                let result = services.registerAdmin(values)
                res.send(responses.sendResponse(res, "User registered succesfully", 200, values))
        }).catch((err) => {
                throw error
        })
        }
        }).catch((error) => {
                throw error
        })
}

exports.loginAdmin = async (req, res) => {
        //if in db or not
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
        //invalid token
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
        //invalid token, drivers not available, bookins not available
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let result = await services.assignDriver(username)
        if (result)
                res.send(responses.sendResponse(res, "Driver assigned", 200, result))
        else
                res.send(responses.sendResponse(res, "Only admins can assign", 400, result))
}