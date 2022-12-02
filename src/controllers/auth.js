const ApiResponse = require('../helpers/ApiResponse')
const { BadRequestError, UnauthorizationError } = require('../helpers/AppError')
const {
    CustomerRepository,
    KeystoreRepository,
    OtpRepository,
    PHistoryRepository,
} = require('../database')
const {
    Auth: { AuthUtils, JWT },
    sendMail: { sendOtp },
} = require('../helpers')
const customerRepository = new CustomerRepository()
const pHistoryRepository = new PHistoryRepository()
const {
    roleAuth: { roles },
} = require('../middlewares')
const {
    jwt: { refreshTokenCookieExpiry },
} = require('../config')

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
            roles: [roles.Customer],
            password: hashedPassword,
            salt,
        }
        if (req.image) data.avatar = req.image
        const createdCustomer = await customerRepository.Create(data)
        await pHistoryRepository.Create(createdCustomer._id)
        const keystore = await KeystoreRepository.Create(createdCustomer._id)
        const { accessToken, refreshToken } = await AuthUtils.createTokens(
            createdCustomer._id,
            keystore.primaryKey,
            keystore.secondaryKey
        )

        new ApiResponse(res)
            .sendCookie('REFRESH_TOKEN', refreshTokenCookieExpiry, refreshToken)
            .status(200)
            .data({ createdCustomer, accessToken })
            .send()
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

        new ApiResponse(res)
            .sendCookie('REFRESH_TOKEN', refreshTokenCookieExpiry, refreshToken)
            .status(200)
            .data({ accessToken })
            .send()
    } catch (e) {
        next(e)
    }
}
const signout = async (req, res, next) => {
    try {
        await KeystoreRepository.Remove(req.keystore._id)
        new ApiResponse(res)
            .removeCookie('REFRESH_TOKEN')
            .status(200)
            .msg('Signout successful!')
            .send()
    } catch (e) {
        next(e)
    }
}

const tokenRefresh = async (req, res, next) => {
    const { authorization } = req.headers
    try {
        const AccessToken = await AuthUtils.getAccessToken(authorization)
        const RefreshToken = await AuthUtils.getRefreshToken(req.signedCookies, 'REFRESH_TOKEN')
        const accessTokenPayload = await JWT.decode(AccessToken) //decoding access token
        if (!accessTokenPayload?.customer && !accessTokenPayload?.primaryKey)
            throw new UnauthorizationError('Invalid access Token!')

        const getCustomer = await customerRepository.FindById(accessTokenPayload.customer)
        if (!getCustomer) throw new UnauthorizationError('Customer is not registered!')
        const refreshTokenPayload = await JWT.decode(RefreshToken) //decoding refresh token
        if (!refreshTokenPayload?.customer && !refreshTokenPayload?.secondaryKey)
            throw new UnauthorizationError('Invalid refresh Token!')
        if (refreshTokenPayload.customer !== accessTokenPayload.customer)
            throw new UnauthorizationError('Invalid token')
        const keystore = await KeystoreRepository.Find(
            getCustomer._id,
            accessTokenPayload.primaryKey,
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
        new ApiResponse(res)
            .sendCookie('REFRESH_TOKEN', refreshTokenCookieExpiry, refreshToken)
            .status(200)
            .data({ accessToken })
            .send()
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
 * (5)send the otpId on reset password  route thrue params = http://example/com/add-new-password/otpId.
 * (6)the add new password and confirm password route will reset the password .
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

const resetPassword = async (req, res, next) => {
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
        new ApiResponse(res).status(200).msg('password reset successful!').send()
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
    resetPassword,
}
