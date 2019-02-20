var jwtDecode = require('jwt-decode')
const constants = require('./../../constants/constants')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {runQuery} = require('./../../databases/db-connection')
const promise=require('bluebird')

exports.registerCustomer =async (customer) => {
    return promise.coroutine(function*(){
        var hash = bcrypt.hashSync(customer.password, constants.SALT_ROUNDS);
        let payload = { un : customer.username, pw : customer.password}
        let token = jwt.sign(payload, constants.KEY, constants.SIGNOPTIONS)
        let values = [
            customer.username,
            hash,
            "passenger",
            customer.first_name,
            customer.last_name,
            customer.phone_number,
            customer.email_id,
            token
        ]
    let sql = 'INSERT INTO `Users`(`username`, `password`, `user_type`, `first_name`, `last_name`, `phone_number`, `email_id`,`token`) VALUES (?,?,?,?,?,?,?,?)'
    const result = yield runQuery(sql,values)
    return result[0]
    })();
}

exports.loginCustomer = async (customer) => {
    return promise.coroutine(function*(){
        const payload = { un: customer.username, pw: customer.password}
        let values1 = [
                jwt.sign(payload, constants.KEY),
                customer.username
        ]
        let values2 = [ customer.username ]
        let sql2 = 'SELECT password FROM Users WHERE username = ?'
        const passwordDb = yield runQuery(sql2,values2)
        const match = yield bcrypt.compare(customer.password, passwordDb[0].password)
        if(match)
        {
            let sql1 = 'UPDATE `Users` SET `token`= ? where username = ?'
            const result = yield runQuery(sql1,values1)
            return result[0]
        }
        })();
}

exports.createBooking = async (customer) => {
        return promise.coroutine(function*(){
            let decoded = jwtDecode(customer.token)
            let username = decoded.un
            let password = decoded.pw
            let values = [username]
            let sql = '(SELECT * FROM `Users` WHERE `username` = ?)'
            const result = yield runQuery(sql, values)
            let values1 = [
                result[0].user_id,
                "pending",
                customer.pickup_latitude,
                customer.pickup_longitude,
                customer.drop_latitude,
                customer.drop_longitude
            ]
            const match = yield bcrypt.compare(password, result[0].password)
            if(match && result[0].username == username)
            {
                    let sql1 = 'INSERT INTO `Bookings`(`customer_id`, `booking_status`, `pickup_latitude`, `pickup_longitude`, `drop_latitude`, `drop_longitude`) VALUES (?,?,?,?,?,?)'
                    const bookings = yield runQuery(sql1,values1)
                    return bookings
            }
            })();
}