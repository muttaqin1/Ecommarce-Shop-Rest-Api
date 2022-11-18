const joi = require('joi')
const { joiAuthBearer } = require('../../helpers/validators')
const joiEmail = joi.string().email()
const joiPassword = joi.string().min(8).max(100)
module.exports = {
    Signin: joi.object({
        email: joiEmail.required(),
        password: joi.string().min(8).max(100).required(),
    }),
    Signup: joi.object({
        name: joi.string().min(3).max(35).required(),
        phone: joi.string().min(7).max(18).required(),
        email: joiEmail.required(),
        password: joi.string().min(8).max(100).required(),
    }),
    refreshToken: joi.object({
        refreshToken: joiAuthBearer().required(),
    }),
    otp: {
        checkEmail: joi.object({
            email: joiEmail.required(),
        }),
        checkOtpId: joi.object({
            otpId: joi.string().required(),
        }),
        otp: joi.object({
            otp: joi.string().max(6).required(),
        }),
        checkPassword: joi.object({
            password: joiPassword.required(),
            confirmPassword: joi.ref('password'),
        }),
    },
    changePass: joi.object({
        oldPassword: joiPassword.required(),
        newPassword: joiPassword.required(),
        confirmPassword: joi.ref('newPassword'),
    }),
}
