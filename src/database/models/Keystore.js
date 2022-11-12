const { Schema, model } = require('mongoose')
const Customer = require('./Customer')

const schema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Customer',
        },
        primaryKey: {
            type: String,
            required: true,
        },
        secondaryKey: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
)

const KeystoreModel = new model('keystore', schema)
module.exports = KeystoreModel

