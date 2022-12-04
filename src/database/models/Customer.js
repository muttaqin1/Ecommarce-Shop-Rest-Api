const { Schema, model } = require('mongoose')
const customerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        emailVerified: { type: Boolean, default: false },
        avatar: {
            url: { type: String, trim: true },
            publicId: { type: String, trim: true },
        },
        password: {
            type: String,
            required: true,
            select: false,
            trim: true,
        },
        salt: {
            type: String,
            required: true,
            select: false,
            trim: true,
        },
        roles: [{ type: Number }],

        address: [{ type: Schema.Types.ObjectId, ref: 'Address', require: true }],

        cart: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
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
        purchaseHistory: { type: Schema.Types.ObjectId, ref: 'PurchaseHistorie' },
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
        timestamps: true,
        versionKey: false,
    }
)

const Customer = new model('Customer', customerSchema)
module.exports = Customer
