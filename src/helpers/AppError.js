const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 401,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
}
//base error class
class AppError extends Error {
    constructor(name, statusCode, description, isOperational, errorStack, logingErrorResponse) {
        super(description)
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = name
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.errorStack = errorStack
        this.logError = logingErrorResponse
        Error.captureStackTrace(this)
    }
}

//api Specific Errors
class APIError extends AppError {
    constructor(
        name,
        statusCode = STATUS_CODES.INTERNAL_ERROR,
        description = 'Internal Server Error',
        isOperational
    ) {
        super(name, statusCode, description, true)
    }
}

//400
class BadRequestError extends AppError {
    constructor(description = 'Bad request') {
        super('BAD REQUEST', STATUS_CODES.BAD_REQUEST, description, true)
    }
}

class BadTokenError extends AppError {
    constructor(description = 'Bad token') {
        super('BadTokenError', STATUS_CODES.UN_AUTHORISED, description, true)
    }
}

class TokenExpiredError extends AppError {
    constructor(description = 'Token is expired!') {
        super('TokenExpiredError', STATUS_CODES.UN_AUTHORISED, description, true)
    }
}

class NotFoundError extends AppError {
    constructor(description) {
        super('NotFoundError', STATUS_CODES.NOT_FOUND, description, true)
    }
}

class UnauthorizationError extends AppError {
    constructor(description = 'Unauthorized!') {
        super('UnauthorizationError', STATUS_CODES.UN_AUTHORISED, description, true)
    }
}

module.exports = {
    AppError,
    APIError,
    BadRequestError,
    NotFoundError,
    STATUS_CODES,
    UnauthorizationError,
    BadTokenError,
    TokenExpiredError,
}
