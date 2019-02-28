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
 * @function <b>checkDrivers</b><br>
 * Returns the count of drivers who have availability status as available
 */

exports.checkDrivers = promise.coroutine(function*(){
        let sql = 'SELECT COUNT(*) as count FROM driver_details WHERE availability_status=0'
        return yield sqlQuery(sql,values)
})

/**
 * @function <b>checkBookings</b><br>
 * Returns if any unassigned bookings are there
 */

exports.checkBookings = promise.coroutine(function*(){
        let sql = 'SELECT COUNT(*) as count FROM bookings WHERE booking_status=0'
        return yield sqlQuery(sql,values)
})

/**
 * @function <b>checkDuplicate</b><br>
 * Returns if any user with the same username exists
 * @param {string(username)}
 */

exports.checkDuplicate = promise.coroutine(function*(values){
        let sql = 'SELECT COUNT(*) AS count FROM users WHERE username=?'
        return yield sqlQuery(sql,values)
})

/**
 * @function <b>inDB</b><br>
 * Checks if the username already exists in the database
 * @param {string(username)}
 */

exports.inDB = promise.coroutine(function*(values){
        let sql = 'SELECT * FROM users WHERE username = ?'
        let values1 = [values.username]
        return yield sqlQuery(sql,values1)
})

/**
 * @function <b>loggedAdminCheck</b><br>
 * Returns the number of admins who are already in the database
 * @param {array(username)}
 */

exports.loggedAdminCheck = promise.coroutine(function*(admin) {
        let values = admin.username
        let sql = '(SELECT COUNT(*) AS count FROM `users` WHERE `user_type` = ?)'
                const result = yield sqlQuery(sql, values)
                return result[0].count
})

/**
 * @function <b>registetDrivers</b><br>
 * @param {array(username, hash, userCode, first_name, last_name, phone_number, email)}
 */

exports.registerAdmin = promise.coroutine(function*(values) {
                console.log("reg")
                let sql = 'INSERT INTO `users`(`username`, `password`, `user_type`, `first_name`, `last_name`, `phone_number`, `email`) VALUES (?,?,?,?,?,?,?)'
                const result = yield sqlQuery(sql, values)
                console.log(result)
                return result
        })

/**
 * @function <b>loginAdmin</b><br>
 * @param {string(username)}
 * @param {string(password)}
 */

exports.loginAdmin = promise.coroutine(function*(values1, password) {
                let sql1 = 'SELECT * FROM `users` WHERE username = ?'
                const adminDb = yield sqlQuery(sql1, values1)
                const match = yield bcrypt.compare(password, adminDb[0].password)
                if (match) return adminDb
})

/**
 * @function <b>viewAllBookings</b><br>
 * @param {array(usertype,username)}
 * @param {string(username)}
 */

exports.viewAllBookings = promise.coroutine(function*(values, username) {
                let sql = 'SELECT COUNT(*) AS count FROM `users` WHERE `user_type` = ? AND username = ?'
                const result = yield sqlQuery(sql, values)
                if (result[0].count == 1) {
                        let sql1 = 'SELECT * FROM bookings'
                        const bookings = yield sqlQuery(sql1)
                        return bookings
                }
})

/**
 * @function <b>assignDriver</b><br>
 * Assigns drivers automatically
 * @param {string(username)}
 */

const assignDriver = promise.coroutine(function*(username) {
                let sql = 'SELECT * FROM bookings WHERE booking_status = 0'
                let bookings = yield sqlQuery(sql)
                for (let i = 0; i < bookings.length; i++) {
                        let sql1 = 'UPDATE bookings SET driver_id = (SELECT driver_id FROM driver_details WHERE availability_status = 0 LIMIT 1), booking_status = 1 WHERE booking_id = ?'
                        let values1 = [bookings[i].booking_id]
                        let result1 = yield sqlQuery(sql1, values1)
                        let sql2 = 'UPDATE driver_details SET availability_status = 1 WHERE driver_id = (SELECT driver_id FROM bookings WHERE booking_id = ?)'
                        if (result1) {
                                let result2 = yield sqlQuery(sql2, values1)
                        }
                }
                let sql1 = 'SELECT * FROM bookings'
                let result2 = yield sqlQuery(sql1)
                let date = moment().format('MMMM Do YYYY , h:mm:ss a');
                let result3 = `Admin with username${username}, assigned ${driver} with ${id}, ${result2[0].driver_id}, ${at} at ${date}`
                MONGO.collection("assignedRides").insertOne({
                        logs: result3
                });
                return result2
})