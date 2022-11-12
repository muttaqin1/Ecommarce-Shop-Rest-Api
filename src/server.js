const path = require('path')
require('dotenv').config({ path: path.join(__dirname, `/../.env`) })
const { connection } = require('./database')
const app = require('./app')

const {
    server: { port, host },
} = require('./config')
const Port = port || 8080

app.listen(Port, host, () => {
    console.log(`server is running on port: ${port}`)
    connection()
}).on('error', (e) => console.log(`server Error: ${e}`))
