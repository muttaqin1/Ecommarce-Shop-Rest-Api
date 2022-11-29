const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1 },
        },
    ],

    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    address: { type: Schema.Types.ObjectId, ref: 'Address' },
    amount: { type: Number, required: true },
})

const Order = new model('Order', orderSchema)
module.exports = Order
