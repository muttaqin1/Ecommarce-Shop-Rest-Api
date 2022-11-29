const { OrderRepository, ProductRepository, CustomerRepository } = require('../database')
const orderRepository = new OrderRepository()
const productRepository = new ProductRepository()
const customerRepository = new CustomerRepository()
const ApiResponse = require('../helpers/ApiResponse')
const { BadRequestError } = require('../helpers/AppError')

const createOrder = async (req, res, next) => {
    const { _id } = req.user
    const { totalPrice, products, address } = req.body
    try {
        const data = {
            customerId: _id,
            products,
            amount: totalPrice,
            address,
        }
        const validateAddress = await customerRepository.GetSingleAddress(_id, address)
        if (!validateAddress) throw new BadRequestError('Invalid address!')
        if (products?.length <= 0) throw new BadRequestError('Product list is empty!')
        if (!totalPrice) {
            const amountArr = await Promise.all(
                products.map(async (products) => {
                    const product = await productRepository.FindById(products.productId)
                    return product.price
                })
            )
            data.amount = amountArr.reduce((acc, curr) => acc + curr)
        }

        const order = await orderRepository.Create(data)
        await customerRepository.AddOrder(_id, order._id)
        new ApiResponse(res).status(200).data({ order }).send()
    } catch (e) {
        next(e)
    }
}

const cancelOrder = async (req, res, next) => {
    const { _id } = req.user
    const { orderId } = req.params
    try {
        const { orders } = await customerRepository.FindById(_id)
        const exists = orders.find((order) => order.toString() === orderId.toString())
        if (!exists) throw new BadRequestError('No order found!')
        await customerRepository.RemoveOrder(_id, exists)
        await orderRepository.Cancel(exists)
        new ApiResponse(res).status(200).msg('Order cancelled.').send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createOrder,
    cancelOrder,
}
