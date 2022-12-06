const Order = require('../models/Order')
const { APIError, STATUS_CODES } = require('../../helpers/AppError')
class OrderRepository {
    async Create(object) {
        try {
            return await Order.create(object)
        } catch {
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
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to find Orders')
        }
    }
    async FindById(orderId) {
        try {
            return await Order.findById(orderId).populate('customerId')
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to find Order')
        }
    }
    async CompleteOrder(orderId) {
        try {
            return await Order.updateOne(
                { _id: orderId },
                {
                    $set: {
                        status: 'completed',
                    },
                }
            )
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to complete Order')
        }
    }
    async GetMonthlyIncome() {
        const currentMonth = new Date(Date.now()).getMonth()
        try {
            const orders = await Order.find({ status: 'completed' })

            if (orders?.length <= 0) {
                return {
                    currentMonthOrders: [],
                    totalEarning: 0,
                }
            }

            const currentMonthOrders = orders
                ?.filter((order) => {
                    const orderMonth = new Date(order?.createdAt)?.getMonth()
                    return currentMonth === orderMonth
                })
                .map((order) => {
                    return {
                        orderId: order._id,
                        amount: order.amount,
                    }
                })
            const totalEarning = currentMonthOrders?.reduce(
                (acc, curr) => Number(acc.amount) + Number(curr.amount)
            )
            return {
                currentMonthOrders,
                totalEarning,
            }
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR)
        }
    }
}

module.exports = OrderRepository
OrderRepository
