const responses = require('./../../responses/responses') 
const services = require('./../services/customer-services')

exports.registerCustomer =async (req,res) => {
        let result  = await services.registerCustomer(req.body)
        res.send(responses.sendResponse(res,"Customer added succesfully",200,result))
}

exports.loginCustomer = async (req,res) => {
    let result = await services.loginCustomer(req.body)
    res.send(responses.sendResponse(res,"User logged in succesfully",200,result))
}

exports.createBooking = async (req,res) => {
    let result = await services.createBooking(req.body)
    res.send(responses.sendResponse(res,"Booking created succesfully",200,result))
}
