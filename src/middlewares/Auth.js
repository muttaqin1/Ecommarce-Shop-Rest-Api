const { auth } = require('./schema')
const { validator, src } = require('../helpers/validators')
const { CustomerRepository, KeystoreRepository } = require('../database')
const customerRepository = new CustomerRepository()
const AuthUtils = require('../helpers/Auth/AuthUtils')
const { BadTokenError, UnauthorizationError } = require('../helpers/AppError')
const JWT = require('../helpers/Auth/JWT')
const authentication = async (req, res, next) => {
    try {
        req.accessToken = await AuthUtils.getAccessToken(req.headers.authorization)

        const { customer, primaryKey } = await JWT.validate(req.accessToken)
        if (!customer && !primaryKey) throw new BadTokenError('Invalid Access token')

        const findCustomer = await customerRepository.FindById(customer)
        if (!findCustomer) throw new UnauthorizationError('user not registered!')
        req.user = findCustomer

        const keystore = await KeystoreRepository.FindforKey(req.user._id, primaryKey)
        if (!keystore) throw new UnauthorizationError('Invalid Access Token!')
        req.keystore = keystore

        return next()
    } catch (error) {
        next(error)
    }
}

module.exports = [validator(auth, src.HEADER), authentication]
