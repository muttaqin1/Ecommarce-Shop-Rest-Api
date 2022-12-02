const joi = require('joi')

module.exports = {
    CreateOrder: joi.object({
        totalPrice: joi.number(),
        products: joi
            .array()
            .items({
                productId: joi.string().required(),
                quantity: joi.number().required(),
            })
            .required(),
        address: joi.string().required(),
    }),
    checkOrderId: joi.object({
        orderId: joi.string().required(),
    }),
}
