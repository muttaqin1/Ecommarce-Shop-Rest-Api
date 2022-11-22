const express = require('express')

const { currentEnvironment } = require('../config')
const expressMiddlewares = [
    express.json({ limit: '1mb' }),
    express.urlencoded({ extended: true, limit: '1mb' }),
]
if (currentEnvironment === 'development') expressMiddlewares.push(require('morgan')('dev'))

module.exports = {
    expressMiddlewares,
    Authentication: require('./Auth'),
    roleAuth: require('./roleAuth'),
}
