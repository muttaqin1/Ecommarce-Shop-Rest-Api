const { Schema, model } = require('mongoose')

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        banner: {
            url: { type: String },
            publicId: { type: String },
        },
        type: {
            type: String,
            required: true,
        },
        unit: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
        suplier: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        reviews: [
            {
                rating: Number,
                customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
                text: { type: String, trim: true },
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Product = new model('Product', productSchema)

module.exports = Product
