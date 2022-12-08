const { NotFoundError } = require('../helpers/AppError')

const NotFound = (req, res, next) => {
    next(new NotFoundError('404 Not Found!'))
}

const errorHandler = (err, req, res, next) => {
    //checks if the header is already sent
    if (res.headerSent) return next()
    const payload = {
        success: false,
        statusCode: err?.statusCode ?? 500,
        message: err?.message ?? 'Something went wrong!',
    }
    console.log(err)
    res.status(payload.statusCode).json(payload)
}

module.exports = [NotFound, errorHandler]
