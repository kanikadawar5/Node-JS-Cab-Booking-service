var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {runQuery} = require('../../databases/sql-connection')
const promise=require('bluebird')

exports.registerCustomer = promise.coroutine(function*(values,values1){
    let sql = 'INSERT INTO `users`(`username`, `password`, `user_type`, `first_name`, `last_name`, `phone_number`, `email`) VALUES (?,?,?,?,?,?,?)'
    const result = yield runQuery(sql,values)
    console.log(result)
    return result
})

exports.loginCustomer = promise.coroutine(function*(values,password){
        let sql = 'SELECT * FROM users WHERE username = ?'
        const customer = yield runQuery(sql,values)
        const match = yield bcrypt.compare(password, customer[0].password)
        if(match)
        return customer
})

exports.createBooking = promise.coroutine(function*(values, customer, password, username){
            let sql = '(SELECT * FROM `users` WHERE `username` = ?)'
            const result = yield runQuery(sql, values)
            let values1 = [
                result[0].user_id,
                "0",
                customer.pickup_latitude,
                customer.pickup_longitude,
                customer.drop_latitude,
                customer.drop_longitude
            ]
            const match = yield bcrypt.compare(password, result[0].password)
            if(match && result[0].username == username)
            {
                    let sql1 = 'INSERT INTO bookings(user_id, booking_status, pickup_latitude, pickup_longitude, drop_latitude, drop_longitude) VALUES (?,?,?,?,?,?)'
                    const insertBookings = yield runQuery(sql1,values1)
                    let sql2 = 'SELECT * FROM bookings WHERE user_id = ?'
                    let values2 = [result[0].user_id]
                    const bookings = yield runQuery(sql2,values2)
                    if(insertBookings && bookings)
                    return bookings
            }
})

exports.viewAllBookings = promise.coroutine(function*(values){
        let sql = 'SELECT * FROM bookings WHERE user_id = (SELECT user_id FROM users WHERE username = ?)'
        return yield runQuery(sql,values)
})