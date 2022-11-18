const joi = require('joi')

module.exports = {
    addAddress: joi.object({
        street: joi.string().max(40).required(),
        postalCode: joi.number().required(),
        city: joi.string().max(20).required(),
        country: joi.string().max(20).required(),
    }),
    removeAddress: joi.object({
        address: joi.string().required(),
    }),
    changename: joi.object({
        name: joi.string().min(3).max(35).required(),
    }),
    AddToCart: joi.object({
        product: joi.string().required(),
        quantity: joi.number().min(1).max(100).required(),
    }),
    RemoveToCart: joi.object({
        productId: joi.string().required(),
    }),
    validateProduct: joi.object({
        productId: joi.string().required(),
    }),
    validateImage: joi.object({
        url: joi.string().required(),
        publicId: joi.string().required(),
    }),
}
