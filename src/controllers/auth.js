const ApiResponse = require('../helpers/ApiResponse')
const { BadRequestError, UnauthorizationError } = require('../helpers/AppError')
const { CustomerRepository, KeystoreRepository, OtpRepository } = require('../database')
const AuthUtils = require('../helpers/Auth/AuthUtils')
const customerRepository = new CustomerRepository()
const JWT = require('../helpers/Auth/JWT')
const { sendOtp } = require('../helpers/sendMail')
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
        if (req.image) data.avatar = req.image
        const createdCustomer = await customerRepository.Create(data)
        const keystore = await KeystoreRepository.Create(createdCustomer._id)
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
        //deleting old keystore document
        const oldKey = await KeystoreRepository.FindByCustomerId(customer)
        if (oldKey && oldKey._id) await KeystoreRepository.Remove(oldKey._id)
        const keystore = await KeystoreRepository.Create(customer._id)
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
        await KeystoreRepository.Remove(req.keystore._id)
        new ApiResponse(res).status(200).msg('Signout successful!').send()
    } catch (e) {
        next(e)
    }
}

const tokenRefresh = async (req, res, next) => {
    try {
        req.accessToken = await AuthUtils.getAccessToken(req.headers.authorization)
        const { customer, primaryKey } = await JWT.decode(req.accessToken) //decoding access token
        if (!customer && !primaryKey) throw new UnauthorizationError('Invalid access Token!')

        const getCustomer = await customerRepository.FindById(customer)
        if (!getCustomer) throw new UnauthorizationError('Customer is not registered!')
        const refreshTokenPayload = await JWT.decode(req.body.refreshToken) //decoding refresh token
        /*
         * compairing accessTokenPayload(customer) === refreshTokenPayload(customer)
         */
        if (refreshTokenPayload.customer !== customer)
            throw new UnauthorizationError('Invalid token')
        const keystore = await KeystoreRepository.Find(
            getCustomer._id,
            primaryKey,
            refreshTokenPayload.secondaryKey
        )
        if (!keystore) throw new UnauthorizationError('Invalid access token')
        await KeystoreRepository.Remove(keystore._id)
        const newKeystore = await KeystoreRepository.Create(getCustomer._id)
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
const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    try {
        const salt = await AuthUtils.GenerateSalt()
        const newPass = await AuthUtils.GeneratePassword(newPassword, salt)

        const validateOldPass = await AuthUtils.ValidatePassword(
            oldPassword,
            req.user.password,
            req.user.salt
        )
        if (!validateOldPass) throw new BadRequestError('Old password doesnt mathched.')

        await customerRepository.ChangePassword(req.user._id, newPass, salt)
        new ApiResponse(res).status(200).msg('Password change successful.').send()
    } catch (e) {
        next(e)
    }
}

/*
 *i am trying to implement two factor authentication
 * (1) the user will send request with his email to the forgot password route.
 * (2)the forgot password route will send a otpId and a message.(dont send the otpId to user).
 * (3)send the otpId on validateOtp route thrue params = http://example.com/validate-otp/otpId.
 * (4)the validate otp route will take the otp from the request body then validate the otp and send a otpId (again dont send the otpId to user).
 * (5)send the otpId on add-new-password route thrue params = http://example/com/add-new-password/otpId.
 * (6)the add new password route will change the password .
 * */

const forgotPassword = async (req, res, next) => {
    const { email } = req.body
    try {
        const customer = await customerRepository.FindByEmail(email)
        if (!customer) throw new BadRequestError('Customer is not registered.')
        const existingOtp = await OtpRepository.FindByEmail(email)
        if (existingOtp) await OtpRepository.Remove(existingOtp._id)
        const otp = await sendOtp(email)
        const otpDoc = await OtpRepository.Create(otp, email)
        new ApiResponse(res)
            .status(200)
            .data({ otpId: otpDoc._id })
            .msg('An otp has been sended to your email.')
            .send()
    } catch (error) {
        next(error)
    }
}

const validateOtp = async (req, res, next) => {
    const { otp } = req.body
    const otpDocId = req.params.otpId || false
    try {
        if (!otpDocId) throw new UnauthorizationError('Permission denied!')
        const otpDoc = await OtpRepository.Find(otpDocId)
        if (!otpDoc) throw new UnauthorizationError('Permission denied!')
        if (otp.toString() !== otpDoc.otp.toString()) throw new BadRequestError('Invalid otp')
        const verifiedOtp = await OtpRepository.Verify(otpDoc._id, true)
        new ApiResponse(res)
            .status(200)
            .data({ otpId: verifiedOtp._id })
            .msg('otp validate successful')
            .send()
    } catch (error) {
        next(error)
    }
}

const addNewPassword = async (req, res, next) => {
    const { password } = req.body
    const otpDocId = req.params.otpId
    try {
        if (!otpDocId) throw new UnauthorizationError('Permission denied')
        const otpDoc = await OtpRepository.Find(otpDocId)
        if (!otpDoc) throw new UnauthorizationError('Permission denied')
        if (!otpDoc.verified) throw new UnauthorizationError('Permission denied')
        const customer = await customerRepository.FindByEmail(otpDoc.holder)
        await customerRepository.ChangePassword(customer._id, password)
        await OtpRepository.Remove(otpDocId)
        new ApiResponse(res).status(200).msg('password change successful!').send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    signup,
    signin,
    signout,
    tokenRefresh,
    changePassword,
    forgotPassword,
    validateOtp,
    addNewPassword,
}
