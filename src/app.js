const express = require('express')
const {
    errorHandlers,
    expressMiddlewares,
    rateLimit: { limitRequest },
} = require('./middlewares')
const { product, customer, auth, seller, stripe, order, admin } = require('./routers')

const app = express()

app.use(expressMiddlewares)

app.use('/api', limitRequest)
app.use('/api', auth)
app.use('/api', product)
app.use('/api', customer)
app.use('/api', seller)
app.use('/api', admin)
app.use('/api', stripe)
app.use('/api', order)

app.use(errorHandlers)

module.exports = app
