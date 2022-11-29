const Order = require('../models/Order')
const { APIError, STATUS_CODES } = require('../../helpers/AppError')
class OrderRepository {
    async Create(object) {
        try {
            return await Order.create(object)
        } catch (e) {
            console.log(e)
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to create order!')
        }
    }
    async Cancel(orderId) {
        try {
            return await Order.findByIdAndDelete(orderId, { new: true }).populate(
                'products.productId'
            )
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to create order!')
        }
    }
    async GetAllOrders() {
        try {
            return await Order.find({ status: 'pending' })
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to get Orders')
        }
    }
}

module.exports = OrderRepository
OrderRepository
