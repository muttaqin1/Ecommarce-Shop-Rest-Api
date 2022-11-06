const { CustomerRepository } = require('../database')
const Auth = require('../helpers/Auth')
const { UnauthorizationError } = require('../helpers/AppError')

const ApiResponse = require('../helpers/ApiResponse')
const customerRepository = new CustomerRepository()

const {
    cookie: { Name },
} = require('../config')

const signup = async (req, res, next) => {
    const { name, phone, email, password } = req.body
    try {
        const salt = await Auth.GenerateSalt()
        const pass = await Auth.GeneratePassword(password, salt)
        const data = {
            name,
            phone,
            email,
            password: pass,
            salt,
        }
        const customer = await customerRepository.Create(data)
        res.status(200).json({
            Success: true,
            StatusCode: res.statusCode,
            customer,
        })
    } catch (e) {
        next(e)
    }
}

const signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const customer = await customerRepository.FindByEmail(email)
        if (!customer) throw new UnauthorizationError('Access Denied!')

        const verify = await Auth.ValidatePassword(password, customer.password, customer.salt)
        if (!verify) throw new UnauthorizationError('Access Denied!')
        const payload = {
            id: customer._id,
            email: customer.email,
        }
        const token = await Auth.GenerateSignature(payload)
        await Auth.SendAuthCookie(res, token)
        ApiResponse.status(200).success(true).data({ token }).send(res)
    } catch (e) {
        next(e)
    }
}

const signout = async (req, res, next) => {
    try {
        res.clearCookie(Name).status(200).json({
            Success: true,
            StatusCode: res.statusCode,
            Message: 'signout successful',
        })
    } catch (e) {
        next(e)
    }
}

module.exports = { signup, signin, signout }
