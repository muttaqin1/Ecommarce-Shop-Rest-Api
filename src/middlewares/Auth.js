const { auth } = require('./schema')
const {
    Auth: { AuthUtils, JWT },
    validators: { validator, src },
} = require('../helpers')
const { CustomerRepository, KeystoreRepository } = require('../database')
const customerRepository = new CustomerRepository()
const { BadTokenError, UnauthorizationError } = require('../helpers/AppError')
//this middleware is used to autenticate the user
const authentication = async (req, res, next) => {
    try {
        //gets the access token
        req.accessToken = await AuthUtils.getAccessToken(req.headers.authorization)
        //validates the token
        const { customer, primaryKey } = await JWT.validate(req.accessToken)
        if (!customer && !primaryKey) throw new BadTokenError('Invalid Access token')

        //finds the customer
        const findCustomer = await customerRepository.FindById(customer)
        if (!findCustomer) throw new UnauthorizationError('user not registered!')
        req.user = findCustomer
        //searches the key inside keystore collection
        const keystore = await KeystoreRepository.FindforKey(req.user._id, primaryKey)
        if (!keystore) throw new UnauthorizationError('Invalid Access Token!')
        req.keystore = keystore

        return next()
    } catch (error) {
        next(error)
    }
}

module.exports = [validator(auth, src.HEADER), authentication]
