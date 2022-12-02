const PHistory = require('../models/PurchaseHistory')
const Customer = require('../models/Customer')
const { APIError, STATUS_CODES } = require('../../helpers/AppError')

class PHistoryRepository {
    async Create(customerId) {
        try {
            const phistory = await PHistory.create({ customerId })
            await Customer.updateOne(
                { _id: customerId },
                {
                    $set: {
                        purchaseHistory: phistory._id,
                    },
                }
            )
        } catch {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to create purchase history!'
            )
        }
    }
    async FindById(id) {
        try {
            return await PHistory.findById(id)
        } catch {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to find purchase history!'
            )
        }
    }

    async AddProducts(PHistoryId, object) {
        try {
            return await PHistory.updateOne(
                { _id: PHistoryId },
                {
                    $push: {
                        products: object,
                    },
                }
            )
        } catch {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to add products in purchase history!'
            )
        }
    }

    async IsExistProduct(PHistoryId, productId) {
        try {
            const { products } = await PHistory.findById(PHistoryId)
            return await products.find((product) => productId.toString() === product.id.toString())
        } catch {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to find product in purchase history!'
            )
        }
    }
}

module.exports = PHistoryRepository
