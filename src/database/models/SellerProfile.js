const { Schema, model } = require('mongoose')

const sellerSchema = new Schema(
    {
        companyName: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true },
        customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
        companyLogo: {
            url: { type: String, required: true },
            publicId: { type: String, required: true },
        },
        sellerVerified: { type: Boolean, default: false },
        products: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
        companyReviews: [
            {
                rating: Number,
                customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
                text: { type: String, required: true, trim: true },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
)
const SellerProfile = new model('Seller', sellerSchema)
module.exports = SellerProfile
