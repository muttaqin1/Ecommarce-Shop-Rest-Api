const { corsUrl } = require('../config')
const { APIError, STATUS_CODES } = require('../helpers/AppError')
const corsOptions = {
    origin: (origin, cb) =>
        origin === corsUrl || !origin
            ? cb(null, true)
            : cb(new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Blocked by cors!')),
    credentials: true,
    optionsSuccessStatus: 200,
}

module.exports = corsOptions
