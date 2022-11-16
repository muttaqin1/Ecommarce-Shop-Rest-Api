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
        addNewPassword,
    },
} = require('../controllers')
const {
    Signin,
    Signup,
    otp: { checkEmail, checkOtpId, otp, checkPassword },
    changePass,
} = require('./schemas/authSchema')
const { validator, src } = require('../helpers/validators')
const avatarUpload = require('../helpers/fileUpload/avatarUpload')

router.post('/auth/signup', validator(Signup), avatarUpload('avatar', 'avatars'), signup)
router.post('/auth/signin', validator(Signin), signin)
router.patch('/auth/token/refresh', tokenRefresh)
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
    '/auth/add-new-password/:otpId',
    validator(checkOtpId, src.PARAM),
    validator(checkPassword),
    addNewPassword
)
module.exports = router
