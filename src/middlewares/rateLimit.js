const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowMs: 1000 * 60,
    max: 5,
    message: {
        message: 'Too many login attempts from this ip, please try again after 60 seconds.',
    },
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            success: false,
            statusCode: options?.statusCode,
            ...options.message,
        })
    },
    standardHeaders: true,
    legacyHeaders: false,
})

const limitRequest = rateLimit({
    max: 150,
    windowMs: 1000 * 60 * 5,
    message: 'Too Many Request from this IP, please try again after 5 minutes.',
})

module.exports = { loginLimiter, limitRequest }
