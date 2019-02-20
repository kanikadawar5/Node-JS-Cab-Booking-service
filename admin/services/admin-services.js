var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {runQuery} = require('./../../databases/db-connection')
const promise=require('bluebird')

exports.loggedAdminCheck =async () => {
        let values = "admin"
        return promise.coroutine(function*(){
        let sql = '(SELECT COUNT(*) AS count FROM `users` WHERE `user_type` = ?)'
        const result = yield  runQuery(sql,values)
        return result[0].count
        })();
}

exports.registerAdmin = async (values) => {
        return promise.coroutine(function*(){
        let sql = 'INSERT INTO `users`(`username`, `password`, `user_type`, `first_name`, `last_name`, `phone_number`, `email`) VALUES (?,?,?,?,?,?,?)'
        const result = yield runQuery(sql,values)
        return result
        })();
}

exports.loginAdmin = (values1,admin) => {
        return promise.coroutine(function*(){
        let sql1 = 'SELECT * FROM `users` WHERE username = ?'
        const adminDb = yield runQuery(sql1,values1)
        const match = yield bcrypt.compare(admin.password, adminDb[0].password)
        if(match) return adminDb
        })();
}

exports.viewAllBookings = async (values,username) => {
        return promise.coroutine(function*(){
        let sql = 'SELECT COUNT(*) AS count FROM `users` WHERE `user_type` = ? AND username = ?'
        const result = yield runQuery(sql, values)
        console.log(result)
            if(result[0].count == 1)
            {
                let sql1 = 'SELECT * FROM bookings'
                const bookings = yield runQuery(sql1)
                return bookings
            }
        })();
}

exports.assignDriver = async (admin) => {
        return promise.coroutine(function*(){
        const result = yield runQuery('(SELECT user_type FROM `Users` WHERE `username`=?)', [username])
        console.log(result)
        // for(let i=0;i<result.length;i++)
        // {
        //     const match = yield bcrypt.compare(password, result[i].password)
        //     if(match && result[i].username == username)
        //     {
        //         let values1 = ["available"]
        //         let sql1 = 'SELECT * FROM driver_details WHERE availability_status = ?'
        //         const drivers = yield runQuery(sql1,values1)
        //         // let values2 = ["assigned","on_duty"]
        //         // let sql2 = 'UPDATE Bookings SET driver_id = ?, booking_status = ?'
        //         // let values1 = ["pending"]
        //         let sql1 = 'SELECT * FROM Bookings WHERE availability_status = ?'
        //         let values3 = ["on_duty"]
        //         let sql3 = 'UPDATE driver_details SET availability_status = ? WHERE driver_id = ?'
        //         const result2 = yield runQuery(sql2, values2)
        //         console.log(result2)
        //         //const result3 = yield runQuery(sql3, values3)
        //         if(result1 && result2)
        //         return result1
        //     }
        // }
        })();
}