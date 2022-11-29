const {
    server: { url },
    stripe: { secretKey },
} = require('../config')
const stripe = require('stripe')(secretKey)
const { ProductRepository, CustomerRepository, OrderRepository } = require('../database')
const productRepository = new ProductRepository()
const customerRepository = new CustomerRepository()
const { BadRequestError } = require('../helpers/AppError')
const ApiResponse = require('../helpers/ApiResponse')

const payment = async (req, res, next) => {
    const { _id } = req.user
    const { items } = req.body
    const products = await productRepository.Products()
    try {
        const sessionConfig = {
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: items.map(({ id, quantity }) => {
                const product = products.find((prod) => prod._id.toString() === id.toString())
                if (product) {
                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: product.name,
                            },
                            unit_amount: product.price,
                        },
                        quantity,
                    }
                }
                throw new BadRequestError('Product not found!')
            }),
            success_url: `${url}/api/order/create`,
            cancel_url: `${url}/api/products`,
        }
        const { url } = await stripe.checkout.sessions.create(sessionConfig)
        new ApiResponse(res).status(200).data({ url }).send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    payment,
}
