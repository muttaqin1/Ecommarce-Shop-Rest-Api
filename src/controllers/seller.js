const {
    CustomerRepository,
    ProductRepository,
    OrderRepository,
    PHistoryRepository,
} = require('../database')

const productRepository = new ProductRepository()
const orderRepository = new OrderRepository()
const customerRepository = new CustomerRepository()
const pHistoryRepository = new PHistoryRepository()
const ApiResponse = require('../helpers/ApiResponse')
const { BadRequestError } = require('../helpers/AppError')
const {
    uploader: { destroy },
} = require('../helpers/fileUpload/cloudinary')

const createProduct = async (req, res, next) => {
    const { name, description, category, unit, price, supplier } = req.body
    try {
        const data = {
            name,
            description,
            category,
            unit,
            price,
            supplier,
        }
        // if (!req.image) throw new BadRequestError('Product image is required!')
        //data.banner = req.image
        const product = await productRepository.CreateProduct(data)
        new ApiResponse(res).status(200).data({ product }).send()
    } catch (e) {
        next(e)
    }
}
const updateProduct = async (req, res, next) => {
    const { productId } = req.params
    const updateItems = req.body
    try {
        if (req.image) updateItems.banner = req.image
        const product = await FindById(productId)
        await destroy(product.banner.publicId) //destroying the current product banner
        const updatedProduct = await productRepository.UpdateProduct(productId, updateItems)
        new ApiResponse(res).status(200).data({ updatedProduct }).send()
    } catch (e) {
        next(e)
    }
}
const deleteProduct = async (req, res, next) => {
    const { productId } = req.params
    try {
        const product = await FindById(productId)
        if (!product) throw new BadRequestError("Product doesn't exist!")
        await destroy(product.banner.publicId) //destroying the product image
        await productRepository.DeleteProduct(productId)
        new ApiResponse(res).status(200).msg('Product Deleted!').send()
    } catch (e) {
        next(e)
    }
}
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderRepository.GetAllOrders()
        new ApiResponse(res).status(200).data({ orders }).send()
    } catch (e) {
        next(e)
    }
}
const completeOrder = async (req, res, next) => {
    const { orderId } = req.params
    try {
        const order = await orderRepository.FindById(orderId)
        if (!order) throw new BadRequestError('No order found!')
        order.products.forEach(async ({ productId, quantity }) => {
            const product = await productRepository.FindById(productId)
            await pHistoryRepository.AddProducts(order.customerId.purchaseHistory, {
                productId,
                quantity,
                price: product.price * quantity,
            })
        })
        await customerRepository.RemoveOrder(order.customerId, order._id)
        await orderRepository.CompleteOrder(orderId)
        new ApiResponse(res).status(200).msg('Order successfuly completed.').send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllOrders,
    completeOrder,
}
