const { UnauthorizationError } = require('../helpers/AppError')
//checks if the person who is trying to enter a route has the required role
const verifyRole =
    (...acceptedRole) =>
    async (req, res, next) => {
        try {
            if (!req.user?.roles) throw new UnauthorizationError('Permission denied')
            //the map function returns a array of boolean value and the find returns a true value if exists
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
    Seller: 465545,
    Customer: 987663,
    Admin: 487223,
}

module.exports = {
    verifyRole,
    roles,
}
