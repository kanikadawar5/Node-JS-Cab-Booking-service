const responses = require('./../../responses/responses') 
var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const services = require('./../services/admin-services')

exports.registerAdmin =async (req,res) => {
        let result  = await services.loggedAdminCheck(req.body)
        if(result < 2)
        {
            result = await services.registerAdmin(req.body)
            res.send(responses.sendResponse(res,"User registered succesfully",200,result))
        }
        else
        res.send(responses.sendResponse(res,"Already two admins",400,result))
}

exports.loginAdmin = async (req,res) => {
        let result = await services.loginAdmin(req.body)
        if(result)
        res.send(responses.sendResponse(res,"User logged in succesfully",200,result))
        else
        res.send(responses.sendResponse(res,"Not an authorised admin",400,result))
}

exports.viewAllBookings = async (req,res) => {
        let result = await services.viewAllBookings(req.body)
        if(result)
        res.send(responses.sendResponse(res,"All bookins",200,result))        
        else
        res.send(responses.sendResponse(res,"Only admins can assign"))
}

exports.assignDriver = async (req,res) => {
        let decoded = jwtDecode(req.body.token)
        let username = decoded.un
        let result = await services.assignDriver(username)
        if(result)
        res.send(responses.sendResponse(res,"Driver assigned",200,result))
        else
        res.send(responses.sendResponse(res,"Only admins can assign",400,result))
}