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
        category: {
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
        supplier: {
            type: String,
            required: true,
        },
        reviews: [
            {
                rating: { type: Number, required: true },
                customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
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
