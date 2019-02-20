var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {runQuery} = require('./../../databases/db-connection')
const promise=require('bluebird')

exports.loggedAdminCheck =async () => {
        let values = "admin"
        return promise.coroutine(function*(){
        let sql = '(SELECT COUNT(*) AS count FROM `Users` WHERE `user_type` = ?)'
        const result = yield  runQuery(sql,values)
        return result[0].count
        })();
}

exports.registerAdmin = async (admin) => {
        return promise.coroutine(function*(){
            var hash = bcrypt.hashSync(admin.password, constants.SALT_ROUNDS);
            let payload = { un : admin.username, pw : admin.password}
            let token = jwt.sign(payload, constants.KEY, constants.SIGNOPTIONS)
            let values = [
                admin.username,
                hash,
                "admin",
                admin.first_name,
                admin.last_name,
                admin.phone_number,
                admin.email_id,
                token
            ]
        let sql = 'INSERT INTO `Users`(`username`, `password`, `user_type`, `first_name`, `last_name`, `phone_number`, `email_id`,`token`) VALUES (?,?,?,?,?,?,?,?)'
        const result = yield runQuery(sql,values)
        return result[0]
        })();
}

exports.loginAdmin = async (admin) => {
        return promise.coroutine(function*(){
        const payload = { un: admin.username, pw: admin.password}
        let values1 = [
                jwt.sign(payload, constants.KEY),
                admin.username
        ]
        let values2 = [ admin.username ]
        let sql2 = 'SELECT password FROM Users WHERE username = ?'
        const passwordDb = yield runQuery(sql2,values2)
        const match = yield bcrypt.compare(admin.password, passwordDb[0].password)
        if(match)
        {
            let sql1 = 'INSERT INTO Users (token) VALUES (?) where username = ?'
            const result = yield runQuery(sql1,values1)
            return result[0]
        }
        })();
}

exports.viewAllBookings = async (admin) => {
        return promise.coroutine(function*(){
        let decoded = jwtDecode(admin.token)
        let username = decoded.un
        let password = decoded.pw
        let values = ["admin"]
        let sql = '(SELECT * FROM `Users` WHERE `user_type` = ?)'
        const result = yield runQuery(sql, values)
        for(let i=0;i<result.length;i++)
        {
            const match = yield bcrypt.compare(password, result[i].password)
            if(match && result[i].username == username)
            {
                let sql1 = 'SELECT * FROM Bookings'
                const bookings = yield runQuery(sql1)
                return bookings
            }
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