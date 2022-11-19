const joi = require('joi')

module.exports = {
    CreateProduct: joi.object({
        name: joi.string().min(3).max(35).required(),
    }),
}
