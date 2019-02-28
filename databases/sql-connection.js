const mysql = require('mysql')
const util=require('util')

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'kanika', // Your mysql username
    password : 'password', // Your mysql password
    database : 'Assignment3'  // Your database name
});


const sqlQuery=util.promisify(connection.query).bind(connection)
module.exports = {sqlQuery}