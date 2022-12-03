const {
    stripe: { secretKey },
} = require('../config')
const stripe = require('stripe')(secretKey)
const { OrderRepository } = require('../database')
const orderRepository = new OrderRepository()
const { BadRequestError } = require('../helpers/AppError')
const ApiResponse = require('../helpers/ApiResponse')

const payment = async (req, res, next) => {
    const { _id, orders } = req.user
    const { orderId, token } = req.body
    try {
        const exists = orders.find((orderid) => orderid.toString() === orderId.toString())
        if (!exists) throw new BadRequestError('Invalid order id.')

        const order = await orderRepository.FindById(orderId)

        await stripe.charges.create({
            amount: order.amount,
            source: token,
            currency: 'usd',
            description: `Order Id: ${order._id}`,
        })
        order.paymentStatus = true
        await order.save()
        new ApiResponse(res).status(200).msg('Payment successful.').send()
    } catch (e) {
        if (e instanceof BadRequestError) return next(e)
        await orderRepository.Cancel(orderId)
        new ApiResponse(res).status(200).msg('Order cancelled due to payment failure!').send()
    }
}

module.exports = {
    payment,
}
