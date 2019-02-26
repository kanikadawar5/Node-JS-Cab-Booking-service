var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
        runQuery
} = require('../../databases/sql-connection')
const promise = require('bluebird')
const moment = require('moment')

exports.checkDrivers = promise.coroutine(function*(values){
        let sql = 'SELECT COUNT(*) FROM driver_details WHERE availability_status=0'
        return yield runQuery(sql,values)
})

exports.checkBookings = promise.coroutine(function*(values){
        let sql = 'SELECT COUNT(*) FROM bookings WHERE booking_status=0'
        return yield runQuery(sql,values)
})

exports.checkDuplicate = promise.coroutine(function*(values){
        let sql = 'SELECT COUNT(*) AS count FROM users WHERE username=?'
        return yield runQuery(sql,values)
})

exports.inDB = promise.coroutine(function*(values){
        let sql = 'SELECT * FROM users WHERE username = ?'
        let values1 = [values.username]
        return yield runQuery(sql,values1)
})

exports.loggedAdminCheck = promise.coroutine(function*(admin) {
        let values = admin.username
        let sql = '(SELECT COUNT(*) AS count FROM `users` WHERE `user_type` = ?)'
                const result = yield runQuery(sql, values)
                return result[0].count
})

exports.registerAdmin = promise.coroutine(function*(values) {
                console.log("reg")
                let sql = 'INSERT INTO `users`(`username`, `password`, `user_type`, `first_name`, `last_name`, `phone_number`, `email`) VALUES (?,?,?,?,?,?,?)'
                const result = yield runQuery(sql, values)
                console.log(result)
                return result
        })

exports.loginAdmin = promise.coroutine(function*(values1, password) {
                let sql1 = 'SELECT * FROM `users` WHERE username = ?'
                const adminDb = yield runQuery(sql1, values1)
                const match = yield bcrypt.compare(password, adminDb[0].password)
                if (match) return adminDb
})

exports.viewAllBookings = promise.coroutine(function*(values, username) {
                let sql = 'SELECT COUNT(*) AS count FROM `users` WHERE `user_type` = ? AND username = ?'
                const result = yield runQuery(sql, values)
                if (result[0].count == 1) {
                        let sql1 = 'SELECT * FROM bookings'
                        const bookings = yield runQuery(sql1)
                        return bookings
                }
})

exports.assignDriver = promise.coroutine(function*(username) {
                let sql = 'SELECT * FROM bookings WHERE booking_status = 0'
                let bookings = yield runQuery(sql)
                for (let i = 0; i < bookings.length; i++) {
                        let sql1 = 'UPDATE bookings SET driver_id = (SELECT driver_id FROM driver_details WHERE availability_status = 0 LIMIT 1), booking_status = 1 WHERE booking_id = ?'
                        let values1 = [bookings[i].booking_id]
                        let result1 = yield runQuery(sql1, values1)
                        let sql2 = 'UPDATE driver_details SET availability_status = 1 WHERE driver_id = (SELECT driver_id FROM bookings WHERE booking_id = ?)'
                        if (result1) {
                                let result2 = yield runQuery(sql2, values1)
                        }
                }
                let sql1 = 'SELECT * FROM bookings'
                let result2 = yield runQuery(sql1)
                let date = moment().format('MMMM Do YYYY , h:mm:ss a');
                let logs = ["Admin with username", username, "assigned driver with id", result2[0].driver_id, "at ", date];
                let result3 = logs.join(' ');
                dbo.collection("assignedRides").insertOne({
                        logs: result3
                });
                return result2
})
