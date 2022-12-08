const path = require('path')
const { readFile } = require('fs')
const { promisify } = require('util')
const { sign, verify } = require('jsonwebtoken')

const { BadTokenError, TokenExpiredError, APIError } = require('../AppError')

class JWT {
    //reading the public key from the keys directory
    static readPublicKey() {
        return promisify(readFile)(path.join(__dirname, '../../../keys/public.pem'), 'utf8')
    }
    //reading the private key from the keys directory
    static readPrivateKey() {
        return promisify(readFile)(path.join(__dirname, '../../../keys/private.pem'), 'utf8')
    }
    // signing the jsonwebtoken using private key
    static async encode(payload, expiry) {
        const cert = await this.readPrivateKey()
        if (!cert) throw new APIError('Token generation failure!')
        return promisify(sign)({ ...payload }, cert, { expiresIn: expiry, algorithm: 'RS256' })
    }
    //validating the jsonwebtoken using public key
    static async validate(token) {
        const cert = await this.readPublicKey()
        if (!cert) throw new APIError('Token generation failure!')
        try {
            return await promisify(verify)(token, cert)
        } catch (e) {
            if (e && e.name === 'TokenExpiredError') throw new TokenExpiredError()
            throw new BadTokenError('Invalid token')
        }
    }
    //decoding the token if it is expired
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
