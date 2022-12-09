const { Schema, model } = require('mongoose')

const tokenSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        code: { type: String, required: true, trim: true, uppercase: true, unique: true },
        discountPercentage: { type: Number, required: true },

        createdAt: {
            type: Date,
            default: Date.now,
            expiry: '3d',
        },
    },
    { timestamps: true, versionKey: false }
)

const DiscountToken = new model('DiscountToken', tokenSchema)
module.exports = DiscountToken
