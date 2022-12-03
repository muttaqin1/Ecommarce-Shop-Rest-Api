const { Schema, model } = require('mongoose')

const orderSchema = new Schema(
    {
        customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, default: 1 },
            },
        ],
        paymentStatus: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
        address: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
        amount: { type: Number, required: true },
    },
    { timestamps: true, versionKey: false }
)

const Order = new model('Order', orderSchema)
module.exports = Order
