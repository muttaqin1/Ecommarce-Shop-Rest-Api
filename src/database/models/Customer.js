const { Schema, model } = require('mongoose')

const customerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: [{ type: Schema.Types.ObjectId, ref: 'Address', require: true }],
        email: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['ADMIN', 'CUSTOMER'],
            default: 'CUSTOMER',
        },
        password: {
            type: String,
            required: true,
            select: false,
        },

        salt: {
            type: String,
            required: true,
            select: false,
        },
        cart: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                unit: { type: Number, required: true },
            },
        ],
        wishlist: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        ],
        orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }],
    },
    {
        timestamps: true,
    }
)

const Customer = new model('Customer', customerSchema)
module.exports = Customer
