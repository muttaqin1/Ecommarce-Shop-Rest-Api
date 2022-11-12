const { CustomerRepository, KeystoreRepository } = require('../database')
const customerRepository = new CustomerRepository()
const AuthUtils = require('../helpers/Auth/AuthUtils')
const { BadTokenError, UnauthorizationError } = require('../helpers/AppError')
const JWT = require('../helpers/Auth/JWT')
const ApiResponse = require('../helpers/ApiResponse')
module.exports = async (req, res, next) => {
    try {
        req.accessToken = await AuthUtils.getAccessToken(req.headers.authorization)

        const { customer, primaryKey } = await JWT.validate(req.accessToken)
        if (!customer && !primaryKey) throw new BadTokenError('Invalid Access token')

        const findCustomer = await customerRepository.FindById(customer)
        if (!findCustomer) throw new UnauthorizationError('user not registered!')
        req.user = findCustomer

        const keystore = await KeystoreRepository.findforKey(req.user._id, primaryKey)
        if (!keystore) throw new UnauthorizationError('Invalid Access Token!')
        req.keystore = keystore

        return next()
    } catch (error) {
        new ApiResponse(res).status(403).msg(error.message).send()
    }
}
