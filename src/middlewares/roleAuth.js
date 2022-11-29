const { UnauthorizationError } = require('../helpers/AppError')

const verifyRole =
    (...acceptedRole) =>
    async (req, res, next) => {
        try {
            if (!req.user?.roles) throw new UnauthorizationError('Permission denied')
            const result = req.user.roles
                .map((role) => acceptedRole.includes(role))
                .find((val) => val === true)
            if (!result) throw new UnauthorizationError('Permission denied!')
            next()
        } catch {
            next(new UnauthorizationError('Permission denied!'))
        }
    }

const roles = {
    Admin: 233320,
    Seller: 465545,
    Customer: 987663,
}

module.exports = {
    verifyRole,
    roles,
}
