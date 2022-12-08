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
    helmet(), //Set's security http headers
    compression(), //compress the response data
    express.json({ limit: '1mb' }), //Reading data from body
    express.urlencoded({ extended: true, limit: '1mb' }),
    cors(corsOptions), //Allow cross-origin requests
    cookieParser(secret), //parse the cookie
    mongoSanitize(), //Data sanitization against Nosql query injection
    xss(), // Data sanitization against xss
    hpp(), // Prevent parameter pollution
]
if (currentEnvironment === 'development') expressMiddlewares.push(require('morgan')('dev'))

module.exports = {
    expressMiddlewares,
    Authentication: require('./Auth'),
    roleAuth: require('./roleAuth'),
    errorHandlers: require('./errorHandlers'),
    rateLimit: require('./rateLimit'),
}
