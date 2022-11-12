const ApiResponse = require('../helpers/ApiResponse')
const { BadRequestError, UnauthorizationError } = require('../helpers/AppError')
const { CustomerRepository, KeystoreRepository } = require('../database')
const AuthUtils = require('../helpers/Auth/AuthUtils')
const customerRepository = new CustomerRepository()
const JWT = require('../helpers/Auth/JWT')

const signup = async (req, res, next) => {
    const { name, phone, email, password } = req.body
    try {
        const customer = await customerRepository.FindByEmail(email)
        if (customer) throw new BadRequestError('User already exist!')
        const salt = await AuthUtils.GenerateSalt()
        const hashedPassword = await AuthUtils.GeneratePassword(password, salt)

        const data = {
            name,
            phone,
            email,
            password: hashedPassword,
            salt,
        }

        const createdCustomer = await customerRepository.Create(data)
        const keystore = await KeystoreRepository.create(createdCustomer._id)
        const { accessToken, refreshToken } = await AuthUtils.createTokens(
            createdCustomer._id,
            keystore.primaryKey,
            keystore.secondaryKey
        )
        new ApiResponse(res).status(200).data({ createdCustomer, accessToken, refreshToken }).send()
    } catch (e) {
        next(e)
    }
}

const signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const customer = await customerRepository.FindByEmail(email)
        if (!customer) throw new UnauthorizationError('Access Denied!')

        const verify = await AuthUtils.ValidatePassword(password, customer.password, customer.salt)
        if (!verify) throw new UnauthorizationError('Access Denied!')
        const keystore = await KeystoreRepository.create(customer._id)
        const { accessToken, refreshToken } = await AuthUtils.createTokens(
            customer,
            keystore.primaryKey,
            keystore.secondaryKey
        )

        new ApiResponse(res).status(200).data({ accessToken, refreshToken }).send()
    } catch (e) {
        next(e)
    }
}
const signout = async (req, res, next) => {
    try {
        await KeystoreRepository.remove(req.keystore._id)
        new ApiResponse(res).status(200).msg('Signout successful!').send()
    } catch (e) {
        next(e)
    }
}

const refresh = async (req, res, next) => {
    try {
        req.accessToken = await AuthUtils.getAccessToken(req.headers.authorization)
        const { customer, primaryKey } = await JWT.decode(req.accessToken) //decoding access token
        if (!customer && !primaryKey) throw new UnauthorizationError('Invalid access Token!')

        const getCustomer = await customerRepository.FindById(customer)
        if (!getCustomer) throw new UnauthorizationError('Customer is not registered!')
        const refreshTokenPayload = await JWT.decode(req.body.refreshToken) //decoding refresh token
        /*
         * compairing accessTokenPayload(custumer) === refreshTokenPayload(customer)
         */
        if (refreshTokenPayload.customer !== customer)
            throw new UnauthorizationError('Invalid token')
        const keystore = await KeystoreRepository.find(
            getCustomer._id,
            primaryKey,
            refreshTokenPayload.secondaryKey
        )
        if (!keystore) throw new UnauthorizationError('Invalid access token')
        await KeystoreRepository.remove(keystore._id)
        const newKeystore = await KeystoreRepository.create(getCustomer._id)
        const { accessToken, refreshToken } = await AuthUtils.createTokens(
            getCustomer,
            newKeystore.primaryKey,
            newKeystore.secondaryKey
        )
        new ApiResponse(res).status(200).data({ accessToken, refreshToken }).send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    signup,
    signin,
    signout,
    refresh,
}
