const { Schema, model } = require('mongoose')
const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        banner: {
            url: { type: String, required: true },
            publicId: { type: String, required: true },
        },
        category: {
            type: String,
            required: true,
            trim: true,
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
            trim: true,
        },
        reviews: [
            {
                rating: { type: Number, required: true },
                customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
                text: { type: String, required: true, trim: true },
            },
        ],
    },
    {
        timestamps: true,
        versionkey: false,
    }
)

const Product = new model('Product', productSchema)

module.exports = Product
