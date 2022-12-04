const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const hpp = require('hpp')
const xss = require('xss-clean')
const compression = require('compression')
const mongoSanitize = require('express-mongo-sanitize')
const cookieParser = require('cookie-parser')

const {
    currentEnvironment,
    cookie: { secret },
} = require('../config')
const corsOptions = require('./cors')

const expressMiddlewares = [
    helmet(),
    compression(),
    express.json({ limit: '1mb' }),
    express.urlencoded({ extended: true, limit: '1mb' }),
    cors(corsOptions),
    cookieParser(secret),
    mongoSanitize(),
    xss(),
    hpp(),
]
if (currentEnvironment === 'development') expressMiddlewares.push(require('morgan')('dev'))

module.exports = {
    expressMiddlewares,
    Authentication: require('./Auth'),
    roleAuth: require('./roleAuth'),
    errorHandlers: require('./errorHandlers'),
    rateLimit: require('./rateLimit'),
}
