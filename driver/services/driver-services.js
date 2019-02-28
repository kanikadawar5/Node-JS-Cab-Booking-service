var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
        sqlQuery
} = require('../../databases/sql-connection')
const promise = require('bluebird')
const moment = require('moment')

/**
 * @function <b>checkDuplicate</b><br>
 * Checks if the driver is already registered
 */

exports.checkDuplicate = promise.coroutine(function*(values){
        let sql = 'SELECT COUNT(*) AS count FROM users WHERE username=?'
        return yield sqlQuery(sql,values)
})

/**
 * @function <b>inDB</b><br>
 * Checks if the username exists in database before logging in
 * @param {string(username)}
 */

exports.inDB = promise.coroutine(function*(values){
        let sql = 'SELECT * FROM users WHERE username = ?'
        let values1 = [values.username]
        return yield sqlQuery(sql,values1)
})

/**
 * @function <b>registerDriver</b><br>
 * @param {array(username,password,user_type,first_name,last_name,phone_number,email,current_latitude,current_longitude)}
 * @param {array(user_id,driver_license,aadhar_card,availability_status,driver_license_expiry_date)}
 * @param {string(username)}
 */

exports.registerDriver = promise.coroutine(function*(values, username, driver) {
        try {
                let sql = 'INSERT INTO `users`(`username`, `password`, `user_type`, `first_name`, `last_name`, `phone_number`, `email`, `current_latitude`, `current_longitude`) VALUES (?,?,?,?,?,?,?,?,?)'
                const result = yield sqlQuery(sql, values)
                let sql1 = 'SELECT user_id FROM users WHERE username = ?'
                const result1 = yield sqlQuery(sql1, username)
                let sql2 = 'INSERT INTO `driver_details`( `user_id`, `driver_license`, `aadhar_card`, `availability_status`, `driver_license_expiry_date`) VALUES (?,?,?,?,?)'
                let values2 = [
                        result1[0].user_id,
                        driver.driver_license,
                        driver.aadhar_card,
                        driver.availability_status,
                        driver.driver_license_expiry_date
                ]
                const result2 = yield sqlQuery(sql2, values2)
                if (result && result1 && result2)
                        return result
        } catch (error) {
                throw error

        }
})

/**
 * @function <b>loginDriver</b><br>
 * @param {string(username)}
 * @param {string(password)}
 */

exports.loginDriver = promise.coroutine(function*(values, password) {
        let sql = 'SELECT * FROM driver_details WHERE driver_id = (SELECT driver_id FROM driver_details WHERE user_id = (SELECT user_id FROM users WHERE username = ?))'
        let driver = yield sqlQuery(sql, values)
        let sql1 = 'SELECT * FROM users WHERE username = ?'
        let users = yield sqlQuery(sql1, values)
        const match = yield bcrypt.compare(password, users[0].password)
        if (match && driver)
                return driver
})

/**
 * @function <b>completeBooking</b><br>
 * @param {array(booking_id,username)}
 * @param {string(username)}
 */

exports.completeBooking = promise.coroutine(function*(values, username) {
        try {
                let sql2 = 'SELECT * FROM driver_details WHERE user_id = (SELECT user_id FROM users WHERE username = ?)'
                let values2 = [username]
                let result2 = yield sqlQuery(sql2, values2)
                if (result2[0].user_id) {
                        console.log(result2)
                        let sql = 'UPDATE bookings SET booking_status = 2 WHERE booking_id = ? AND driver_id = (SELECT driver_id FROM driver_details WHERE user_id = (SELECT user_id FROM users WHERE username = ?))'
                        let sql1 = 'UPDATE driver_details SET availability_status = 0 WHERE driver_id = (SELECT driver_id FROM bookings WHERE booking_id=?) AND user_id=(SELECT user_id FROM users WHERE username = ?)'
                        let result = yield sqlQuery(sql, values)
                        let date = moment().format('MMMM Do YYYY , h:mm:ss a')
                        let logs = `Driver with ${result2[0].driver_id}, changes status of booking at, ${date}`
                        MONGO.collection("completedRides").insertOne({
                                logs: result3
                        })
                        if (result) {
                                let result1 = yield sqlQuery(sql1, values)
                                return result1
                        }
                }
        } catch (error) {
                throw error
        }
})

/**
 * @function <b>viewAssignedBookings</b><br>
 * @param {string(username)}
 */

exports.viewAssignedBookings = promise.coroutine(function*(values) {
        try {
                let sql = 'SELECT * from bookings WHERE driver_id = (SELECT driver_id FROM driver_details WHERE user_id = (SELECT user_id FROM users WHERE username = ?)) AND booking_status=1'
                let result = yield sqlQuery(sql, values)
                if (result)
                        return result
        } catch (error) {
                throw error
        }
})

/**
 * @function <b>viewAllBookings</b><br>
 * @param {array(username)}
 */

exports.viewAllBookings = promise.coroutine(function*(values) {
        let sql = 'SELECT * FROM bookings WHERE user_id = (SELECT user_id FROM users WHERE username = ?)'
        let result = yield sqlQuery(sql, values)
        return result
})

/**
 * @function <b>logoutDriver</b><br>
 * @param {string(token)}
 */

exports.logoutDriver = promise.coroutine(function*(token){
        let sql = 'INSERT INTO `expired_tokens`(`token`) VALUES (?)'
        let result = yield sqlQuery(sql,token)
        return result
})

/**
 * @function <b>checkIfLoggedOut</b><br>
 * @param {string(token)}
 */

 exports.checkIfLoggedOut = promise.coroutine(function*(token) {
         let sql = 'SELECT COUNT(*) AS count FROM `expired_tokens` WHERE `token`=?'
         let result = yield sqlQuery(sql,token)
         return result
 })