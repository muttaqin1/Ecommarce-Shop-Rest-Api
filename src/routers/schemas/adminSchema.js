const joi = require('joi')

module.exports = {
    checkSellerId: joi.object({
        sellerRequestId: joi.string().required(),
    }),
}
