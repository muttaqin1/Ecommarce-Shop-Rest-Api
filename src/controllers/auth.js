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
        //generating salt to hash a plain text password
        const salt = await AuthUtils.GenerateSalt()
        //hashing the plain text password
        const hashedPassword = await AuthUtils.GeneratePassword(password, salt)

        const data = {
            name,
            phone,
            email,
            roles: [roles.Customer],
            password: hashedPassword,
            salt,
        }
        //optional avatar upload
        if (req.image) data.avatar = req.image
        //creating customer
        const createdCustomer = await customerRepository.Create(data)
        //creating purchase history
        await pHistoryRepository.Create(createdCustomer._id)
        //creating a keystore document
        const keystore = await KeystoreRepository.Create(createdCustomer._id)
        //creating access and refresh token
        const { accessToken, refreshToken } = await AuthUtils.createTokens(
            createdCustomer._id,
            keystore.primaryKey,
            keystore.secondaryKey
        )
        //refresh token will be stored in cookies
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
        //validating password
        const verify = await AuthUtils.ValidatePassword(password, customer.password, customer.salt)
        if (!verify) throw new UnauthorizationError('Invalid Password!')
        //deleting old keystore document
        const oldKey = await KeystoreRepository.FindByCustomerId(customer)
        if (oldKey && oldKey?._id) await KeystoreRepository.Remove(oldKey._id)
        //creating a new keystore document
        const keystore = await KeystoreRepository.Create(customer._id)
        //creating access and refresh token
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
        //removing the keystore document
        await KeystoreRepository.Remove(req.keystore._id)
        //sending response and removing refresh token form cookies
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
        //reading access and refresh token
        const AccessToken = await AuthUtils.getAccessToken(authorization)
        const RefreshToken = await AuthUtils.getRefreshToken(req.signedCookies, 'REFRESH_TOKEN')
        //decoding access token
        const accessTokenPayload = await JWT.decode(AccessToken)
        if (!accessTokenPayload?.customer && !accessTokenPayload?.primaryKey)
            throw new UnauthorizationError('Invalid access Token!')
        //searching customer with the id which i get from accecc token
        const getCustomer = await customerRepository.FindById(accessTokenPayload.customer)
        if (!getCustomer) throw new UnauthorizationError('Customer is not registered!')
        //decoding refresh token
        const refreshTokenPayload = await JWT.decode(RefreshToken)
        if (!refreshTokenPayload?.customer && !refreshTokenPayload?.secondaryKey)
            throw new UnauthorizationError('Invalid refresh Token!')
        if (refreshTokenPayload.customer !== accessTokenPayload.customer)
            throw new UnauthorizationError('Invalid token')
        //searching the keystore document
        const keystore = await KeystoreRepository.Find(
            getCustomer._id,
            accessTokenPayload.primaryKey,
            refreshTokenPayload.secondaryKey
        )
        if (!keystore) throw new UnauthorizationError('Invalid access token')
        //removing the old keystore
        await KeystoreRepository.Remove(keystore._id)
        //creating new keystore document
        const newKeystore = await KeystoreRepository.Create(getCustomer._id)
        //creating access and refresh token
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
        //generating salt for hashing a plain text password
        const salt = await AuthUtils.GenerateSalt()
        //generating password with the help of plain text password and salt
        const newPass = await AuthUtils.GeneratePassword(newPassword, salt)

        const validateOldPass = await AuthUtils.ValidatePassword(
            oldPassword,
            req.user.password,
            req.user.salt
        )
        if (!validateOldPass) throw new BadRequestError('Old password doesnt mathched.')

        //changing the password
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
        //removing duplicate data
        if (existingOtp) await OtpRepository.Remove(existingOtp._id)
        //sending otp by email
        const otp = await sendOtp(email)
        //creating a new otp document
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
    const { otpId: otpDocId } = req.params
    try {
        const otpDoc = await OtpRepository.Find(otpDocId)
        if (!otpDoc) throw new BadRequestError('Invalid otp!')
        if (otp.toUpperCase().toString() !== otpDoc.otp.toString())
            throw new BadRequestError('Invalid otp')
        //verifing the otp
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
        //generating salt
        const salt = await AuthUtils.GenerateSalt()
        //hashing the plain text password
        const hashedPassword = await AuthUtils.GeneratePassword(password, salt)
        //changing the password
        await customerRepository.ChangePassword(customer._id, hashedPassword)
        //removing the otp document
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
