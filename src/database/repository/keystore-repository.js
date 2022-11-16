const KeystoreModel = require('../models/Keystore')
const Customer = require('../models/Customer')
const crypto = require('crypto')
class KeystoreRepository {
    static async FindforKey(customer, key) {
        return await KeystoreModel.findOne({
            customer: customer,
            primaryKey: key,
        })
    }

    static async Remove(id) {
        return await KeystoreModel.findByIdAndRemove(id)
    }

    static async Find(customer, primaryKey, secondaryKey) {
        return await KeystoreModel.findOne({
            customer: customer,
            primaryKey: primaryKey,
            secondaryKey: secondaryKey,
        })
    }
    static async FindByCustomerId(customer) {
        return await KeystoreModel.findOne({ customer: customer._id })
    }
    static async Create(customer) {
        const accessTokenKey = crypto.randomBytes(64).toString('hex')
        const refreshTokenKey = crypto.randomBytes(64).toString('hex')

        return await KeystoreModel.create({
            customer: customer,
            primaryKey: accessTokenKey,
            secondaryKey: refreshTokenKey,
        })
    }
}
module.exports = KeystoreRepository
