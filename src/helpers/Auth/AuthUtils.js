const JWT = require('./JWT')
const { UnauthorizationError } = require('../AppError')
const {
    jwt: { tokenIssuer, tokenAudience, accessTokenValidityDays, refreshTokenValidityDays },
} = require('../../config')
const bcrypt = require('bcryptjs')
const { APIError } = require('../AppError')
class AuthUtils {
    static async GenerateSalt() {
        return await bcrypt.genSalt()
    }

    static async GeneratePassword(password, salt) {
        return await bcrypt.hash(password, salt)
    }

    static async ValidatePassword(enteredPass, pass, salt) {
        const generatedPass = await bcrypt.hash(enteredPass, salt)
        return generatedPass === pass
    }
    static async getAccessToken(authorization) {
        if (!authorization) throw new UnauthorizationError('Invalid Authorization')
        if (!authorization.startsWith('Bearer '))
            throw new UnauthorizationError('Invalid Authorization')
        return authorization.split(' ')[1]
    }
    static async getRefreshToken(signedCookies, cookieName) {
        const cookies = Object.keys(signedCookies)?.length > 0 ? signedCookies : false
        if (!cookies) throw new UnauthorizationError('No token found!')
        const token = cookies[cookieName]
        if (!token) throw new UnauthorizationError('No token found!')
        return token
    }
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
