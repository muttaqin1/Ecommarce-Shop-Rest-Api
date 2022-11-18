const { UnauthorizationError } = require('../helpers/AppError')

const ApiResponse = require('../helpers/ApiResponse')

const verifyRole = (acceptedRole) => async (req, res, next) => {
    try {
        if (!req.user || !req.user.role) throw new UnauthorizationError('Permission denied')
        if (req.user.role !== acceptedRole) throw new UnauthorizationError('Permission denied')
        return next()
    } catch (e) {
        new ApiResponse(res).status(200).msg(e.message).send()
    }
}

const roles = {
    admin: 'ADMIN',
    seller: 'SELLER',
    customer: 'CUSTOMER',
}

module.exports = {
    verifyRole,
    roles,
}