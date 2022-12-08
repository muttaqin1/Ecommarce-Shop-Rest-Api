const JWT = require('./JWT')
const { UnauthorizationError, AppError } = require('../AppError')
const {
    jwt: { tokenIssuer, tokenAudience, accessTokenValidityDays, refreshTokenValidityDays },
} = require('../../config')
const bcrypt = require('bcryptjs')
class AuthUtils {
    //generating salt
    static async GenerateSalt() {
        return await bcrypt.genSalt()
    }
    //generating password using a plain text password and a generated salt
    static async GeneratePassword(password, salt) {
        return await bcrypt.hash(password, salt)
    }
    //validating password using the plain text password and the hashed password
    static async ValidatePassword(enteredPass, pass, salt) {
        const generatedPass = await bcrypt.hash(enteredPass, salt)
        return generatedPass === pass
    }
    //validating access token
    static async getAccessToken(authorization) {
        if (!authorization) throw new UnauthorizationError('Invalid Authorization')
        if (!authorization.startsWith('Bearer '))
            throw new UnauthorizationError('Invalid Authorization')
        return authorization.split(' ')[1]
    }
    //validating refresh token
    static async getRefreshToken(signedCookies, cookieName) {
        const cookies = Object.keys(signedCookies)?.length > 0 ? signedCookies : false
        if (!cookies) throw new UnauthorizationError('No token found!')
        const token = cookies[cookieName]
        if (!token) throw new UnauthorizationError('No token found!')
        return token
    }
    //generating access and refresh token
    static async createTokens(customer, accessTokenKey, refreshTokenKey) {
        try {
            const accessToken = await JWT.encode(
                {
                    issuer: tokenIssuer,
                    audience: tokenAudience,
                    customer: customer._id,
                    primaryKey: accessTokenKey,
                },
                accessTokenValidityDays
            )
            const refreshToken = await JWT.encode(
                {
                    issuer: tokenIssuer,
                    audience: tokenAudience,
                    customer: customer._id,
                    secondaryKey: refreshTokenKey,
                },
                refreshTokenValidityDays
            )

            return {
                accessToken: accessToken,
                refreshToken: refreshToken,
            }
        } catch {
            throw new APIError()
        }
    }
}

module.exports = AuthUtils
