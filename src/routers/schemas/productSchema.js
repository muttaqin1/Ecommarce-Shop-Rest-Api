const joi = require('joi')

module.exports = {
    checkProductId: joi.object({
        productId: joi.string().required(),
    }),
    CreateReview: joi.object({
        rating: joi.number().min(1).max(5).required(),
        text: joi.string().max(100).required(),
    }),
    UpdateReview: joi.object({
        rating: joi.number().min(1).max(5),
        text: joi.string().max(200),
    }),
}
