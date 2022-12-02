const { Schema, model } = require('mongoose')

const KeystoreSchema = new Schema(
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

const KeystoreModel = new model('keystore', KeystoreSchema)
module.exports = KeystoreModel
