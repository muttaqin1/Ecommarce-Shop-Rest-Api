const { Schema, model } = require('mongoose')

const PHistorySchema = new Schema(
    {
        customerId: { type: Schema.Types.ObjectId, required: true, ref: 'Customer' },
        products: [
            {
                id: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                date: { type: Date, default: Date.now },
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
            select: false,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            select: false,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
)

const PHistory = new model('PurchaseHistorie', PHistorySchema)
module.exports = PHistory
