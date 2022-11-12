const path = require('path')
const { readFile } = require('fs')
const { promisify } = require('util')
const { sign, verify } = require('jsonwebtoken')

const { BadTokenError, TokenExpiredError, APIError } = require('../AppError')

class JWT {
    static readPublicKey() {
        return promisify(readFile)(path.join(__dirname, '../../../keys/public.pem'), 'utf8')
    }

    static readPrivateKey() {
        return promisify(readFile)(path.join(__dirname, '../../../keys/private.pem'), 'utf8')
    }

    static async encode(payload, expiry) {
        const cert = await this.readPrivateKey()
        if (!cert) throw new APIError('Token generation failure!')
        return promisify(sign)({ ...payload }, cert, { expiresIn: expiry, algorithm: 'RS256' })
    }

    static async validate(token) {
        const cert = await this.readPublicKey()
        if (!cert) throw new APIError('Token generation failure!')
        try {
            return await promisify(verify)(token, cert)
        } catch (e) {
            if (e && e.name === 'TokenExpiredError') throw new TokenExpiredError()
            throw new BadTokenError()
        }
    }

    static async decode(token) {
        const cert = await this.readPublicKey()
        try {
            return await promisify(verify)(token, cert, { ignoreExpiration: true })
        } catch (e) {
            throw new BadTokenError(e)
        }
    }
}
module.exports = JWT
