const express = require('express')

const { environment } = require('../config')
const expressMiddlewares = [
    express.json({ limit: '1mb' }),
    express.urlencoded({ extended: true, limit: '1mb' }),
]
if (environment === 'development') expressMiddlewares.push(require('morgan')('dev'))

module.exports = {
    expressMiddlewares,
    Authentication: require('./Auth'),
}
