const { UnauthorizationError } = require('../helpers/AppError')

const verifyRole = (acceptedRole) => async (req, res, next) => {
    try {
        if (!req.user || !req.user.role) throw new UnauthorizationError('Permission denied')
        if (req.user.role !== acceptedRole) throw new UnauthorizationError('Permission denied')
        return next()
    } catch {
        next(new UnauthorizationError('Permission denied!'))
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
