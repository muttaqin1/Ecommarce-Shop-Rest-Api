const { connection: mongoConnection } = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, `/../.env`) })
const { connection } = require('./database')
const app = require('./app')

const {
    server: { port, host },
} = require('./config')

const Port = port || 8080

const server = app.listen(Port, host, () => {
    console.log(`Server is running on PORT: ${Port}`)
    connection()
})

server.on('close', () => console.log('Server is closed!'))
server.on('error', (e) => console.log(e))

process.on('SIGINT', () => {
    server.close(async () => {
        await mongoConnection.close(false)
        process.exit(0)
    })
})

process.on('SIGTERM', () => {
    server.close(async () => {
        await mongoConnection.close(false)
        process.exit(0)
    })
})
