const { ProductRepository, OrderRepository } = require('../database')
const productRepository = new ProductRepository()
const orderRepository = new OrderRepository()
const ApiResponse = require('../helpers/ApiResponse')
const { BadRequestError } = require('../helpers/AppError')
const {
    uploader: { destroy },
} = require('../helpers/fileUpload/cloudinary')

const createProduct = async (req, res, next) => {
    const { name, description, type, unit, price, supplier } = req.body
    try {
        const data = {
            name,
            description,
            type,
            unit,
            price,
            supplier,
        }
        if (!req.image) throw new BadRequestError('Product image is required!')
        data.banner = req.image
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
        new ApiResponse(res).status(200).data({ orders })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllOrders,
}
