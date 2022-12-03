const DiscountToken = require('../models/DiscountToken')
const { BadRequestError, APIError, STATUS_CODES } = require('../../helpers/AppError')
class DiscountTokenRepository {
    async Create(object) {
        try {
            return await DiscountToken.create(object)
        } catch (e) {
            throw new BadRequestError('Discount token code must be unique!')
        }
    }

    async FindByCode(code) {
        try {
            return await DiscountToken.findOne({ code })
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to find token!')
        }
    }
}
module.exports = DiscountTokenRepository
