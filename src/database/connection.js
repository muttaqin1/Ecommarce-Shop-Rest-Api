const mongoose = require('mongoose')

const {
    database: { mongo_uri },
} = require('../config')

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const connection = async () => {
    try {
        mongoose.connect(mongo_uri, options)
        console.log('database connected!')
    } catch (e) {
        console.log(e.message)
    }
}
mongoose.connection.on('connection', () => {
    console.log('database connected.')
})
mongoose.connection.on('error', (err) => {
    console.log(`Mongoose default connection Error: ${err}`)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected!')
})

module.exports = connection
