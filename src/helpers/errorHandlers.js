const { environment } = require('../config')
const { NotFoundError } = require('./AppError')

const NotFound = (req, res, next) => {
    const error = new NotFoundError('404 not found!')
    next(error)
}

const ErrorHandler = (err, req, res, next) => {
    if (res.headerSent) return next(err)
    console.log(err)
    console.log('status code is ' + err.statusCode)

    const payload = {
        Success: false,
        StatusCode: err.statusCode,
        Message: err.message,
    }

    res.status(err.statusCode || 500).json(payload)
}

module.exports = [NotFound, ErrorHandler]
