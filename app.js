const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const app = express()
const body_parser = require('body-parser')
const port = process.env.PORT || 3002
const http = require('http');
const server = http.createServer(app)
const dbo = require('./databases/mongo-connection.js')
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))

server.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log(`Listening at http://${host}${port}`)
});

const admin = require('./admin/admin')
const customer = require('./customers/customers')
const driver = require('./driver/driver')
// const admin = require('./admin/admin')

app.use(body_parser.urlencoded ({extended: false}))     //true for extended bodies with rich body in it
app.use(body_parser.json())

app.use('/admin',admin)
app.use('/customer',customer)
app.use('/driver',driver)