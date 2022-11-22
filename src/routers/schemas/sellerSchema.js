const joi = require('joi')
module.exports = {
    CreateProduct: joi.object({
        name: joi.string().min(3).max(35).required(),
        description: joi.string().min(20).max(400),
        price: joi.number().required(),
        type: joi.string().max(22).required(),
        unit: joi.number(),
    }),

    UpdateProduct: joi.object({
        name: joi.string().min(3).max(35),
        description: joi.string().min(20).max(400),
        price: joi.number(),
        type: joi.string().max(22),
        unit: joi.number(),
    }),
}