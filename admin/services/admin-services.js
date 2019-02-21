var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
        runQuery
} = require('../../databases/sql-connection')
const promise = require('bluebird')
const moment = require('moment')

exports.loggedAdminCheck = async () => {
        let values = "admin"
        return promise.coroutine(function*() {
                let sql = '(SELECT COUNT(*) AS count FROM `users` WHERE `user_type` = ?)'
                const result = yield runQuery(sql, values)
                return result[0].count
        })();
}

exports.registerAdmin = async (values) => {
        return promise.coroutine(function*() {
                let sql = 'INSERT INTO `users`(`username`, `password`, `user_type`, `first_name`, `last_name`, `phone_number`, `email`) VALUES (?,?,?,?,?,?,?)'
                const result = yield runQuery(sql, values)
                return result
        })();
}

exports.loginAdmin = (values1, password) => {
        return promise.coroutine(function*() {
                let sql1 = 'SELECT * FROM `users` WHERE username = ?'
                const adminDb = yield runQuery(sql1, values1)
                const match = yield bcrypt.compare(password, adminDb[0].password)
                if (match) return adminDb
        })();
}

exports.viewAllBookings = async (values, username) => {
        return promise.coroutine(function*() {
                let sql = 'SELECT COUNT(*) AS count FROM `users` WHERE `user_type` = ? AND username = ?'
                const result = yield runQuery(sql, values)
                if (result[0].count == 1) {
                        let sql1 = 'SELECT * FROM bookings'
                        const bookings = yield runQuery(sql1)
                        return bookings
                }
        })();
}

exports.assignDriver = async (username) => {
        return promise.coroutine(function*() {
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
        })();
}