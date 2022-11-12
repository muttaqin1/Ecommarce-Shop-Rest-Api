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

    static async createTokens(customer, accessTokenKey, refreshTokenKey) {
        const accessToken = await JWT.encode(
            {
                issuer: tokenIssuer,
                audience: tokenAudience,
                customer: customer._id,
                primaryKey: accessTokenKey,
            },
            accessTokenValidityDays
        )
        if (!accessToken) throw new APIError()

        const refreshToken = await JWT.encode(
            {
                issuer: tokenIssuer,
                audience: tokenAudience,
                customer: customer._id,
                secondaryKey: refreshTokenKey,
            },
            refreshTokenValidityDays
        )

        if (!refreshToken) throw new APIError()

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        }
    }
}

module.exports = AuthUtils
