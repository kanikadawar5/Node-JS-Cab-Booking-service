var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {runQuery} = require('../../databases/sql-connection')
const promise=require('bluebird')

exports.registerDriver = promise.coroutine(function*(values, values1, driver){
    try{
    let sql = 'INSERT INTO `users`(`username`, `password`, `user_type`, `first_name`, `last_name`, `phone_number`, `email`, `current_latitude`, `current_longitude`) VALUES (?,?,?,?,?,?,?,?,?)'
    const result = yield runQuery(sql,values)
    let sql1 = 'SELECT user_id FROM users WHERE username = ?'
    const result1 = yield runQuery(sql1,values1)
    let sql2 = 'INSERT INTO `driver_details`( `user_id`, `driver_license`, `aadhar_card`, `availability_status`, `driver_license_expiry_date`) VALUES (?,?,?,?,?)'
    let values2 = [
    result1[0].user_id,
    driver.driver_license,
    driver.aadhar_card,
    driver.availability_status,
    driver.driver_license_expiry_date
    ]
    const result2 = yield runQuery(sql2,values2)
    if(result && result1 && result2)
    return result
    }
    catch (error){
        throw error
        
    }
})

exports.loginDriver = promise.coroutine(function*(values,password){
        let sql = 'SELECT * FROM driver_details WHERE driver_id = (SELECT driver_id FROM driver_details WHERE user_id = (SELECT user_id FROM users WHERE username = ?))'
        let driver = yield runQuery(sql,values)
        let sql1 = 'SELECT * FROM users WHERE username = ?'
        let users = yield runQuery(sql1, values)
        const match = yield bcrypt.compare(password, users[0].password)
        if(match && driver)
        return driver
})

exports.completeBooking = promise.coroutine(function*(values, driver, password, username){
        try{
                let sql = 'UPDATE bookings SET booking_status = 2 WHERE booking_id = ? AND driver_id = (SELECT driver_id FROM driver_details WHERE user_id = (SELECT user_id FROM users WHERE username = ?))'
                let sql1 = 'UPDATE driver_details SET availability_status = 0 WHERE driver_id = (SELECT driver_id FROM bookings WHERE booking_id=?) AND user_id=(SELECT user_id FROM users WHERE username = ?)'
                let result = yield runQuery(sql,values)
                if(result){let result1 = yield runQuery(sql1,values)
                    return result1}
        }
        catch(error){
            throw error
        }
})

exports.viewAssignedBookings = promise.coroutine(function*(values) {
        try{let sql = 'SELECT * from bookings WHERE driver_id = (SELECT driver_id FROM driver_details WHERE user_id = (SELECT user_id FROM users WHERE username = ?)) AND booking_status=1'
        let result = yield runQuery(sql,values)
        if(result)
        return result
        }
        catch(error) {
            throw error
        }
})

exports.viewAllBookings = promise.coroutine(function*(values){
        let sql = 'SELECT * FROM bookings WHERE user_id = (SELECT user_id FROM users WHERE username = ?)'
        let result = yield runQuery(sql,values)
        return result
})