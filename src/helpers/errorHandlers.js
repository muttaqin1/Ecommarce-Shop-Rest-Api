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
        Message: err.message || 'Something went wrong!',
    }
    if (err instanceof TypeError) {
        payload.Message = 'Something went wrong!'
        payload.StatusCode = 500
    }
    res.status(payload.StatusCode || 500).json(payload)
}

module.exports = [NotFound, ErrorHandler]
