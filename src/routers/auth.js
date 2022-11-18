const router = require('express').Router()
const { Authentication } = require('../middlewares')
const {
    authController: {
        signup,
        signin,
        signout,
        tokenRefresh,
        changePassword,
        forgotPassword,
        validateOtp,
        resetPassword,
    },
} = require('../controllers')
const {
    Signin,
    Signup,
    refreshToken,
    otp: { checkEmail, checkOtpId, otp, checkPassword },
    changePass,
} = require('./schemas/authSchema')
const { validateImage } = require('./schemas/customerSchema')
const { validator, src } = require('../helpers/validators')
const imageUpload = require('../helpers/fileUpload/imageUpload')

router.post(
    '/auth/signup',
    validator(Signup),
    imageUpload('avatar', 'avatars'),
    validator(validateImage, src.IMAGE),
    signup
)
router.post('/auth/signin', validator(Signin), signin)
router.patch('/auth/token/refresh', validator(refreshToken), tokenRefresh)
router.patch('/auth/change-password', Authentication, validator(changePass), changePassword)
router.delete('/auth/signout', Authentication, signout)
router.post('/auth/forgot-password', validator(checkEmail), forgotPassword)
router.post(
    '/auth/validate-otp/:otpId',
    validator(checkOtpId, src.PARAM),
    validator(otp),
    validateOtp
)
router.post(
    '/auth/reset-password/:otpId',
    validator(checkOtpId, src.PARAM),
    validator(checkPassword),
    resetPassword
)

module.exports = router
