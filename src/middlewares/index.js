const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {
    currentEnvironment,
    cookie: { secret },
} = require('../config')
const corsOptions = require('./cors')

const expressMiddlewares = [
    express.json({ limit: '1mb' }),
    express.urlencoded({ extended: true, limit: '1mb' }),
    cors(corsOptions),
    cookieParser(secret),
]
if (currentEnvironment === 'development') expressMiddlewares.push(require('morgan')('dev'))

module.exports = {
    expressMiddlewares,
    Authentication: require('./Auth'),
    roleAuth: require('./roleAuth'),
    errorHandlers: require('./errorHandlers'),
}
