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
        console.log('Databse connected!')
    } catch (e) {
        console.log('=============================ERROR=============================')
        console.log(e.message)
        process.exit(1)
    }
}
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose connection disconnected!')
        process.exit(0)
    })
})

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose default connection Error: ${err}`)
})

module.exports = connection
