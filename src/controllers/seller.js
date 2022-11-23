const { ProductRepository, SellerRepository } = require('../database')
const { CreateProduct, DeleteProduct, UpdateProduct, FindById } = new ProductRepository()
const ApiResponse = require('../helpers/ApiResponse')
const { BadRequestError } = require('../helpers/AppError')
const sellerRepository = new SellerRepository()
const {
    uploader: { destroy },
} = require('../helpers/fileUpload/cloudinary')

const createProduct = async (req, res, next) => {
    const { sellerAccount } = req.user
    const { name, description, type, unit, price } = req.body
    try {
        const data = {
            name,
            description,
            type,
            unit,
            price,
            supplier: sellerAccount._id,
        }
        if (!req.image) throw new BadRequestError('Product image is required!')
        data.banner = req.image
        const product = await CreateProduct(data)
        await sellerRepository.AddProduct(sellerAccount._id, product)
        new ApiResponse(res).status(200).data({ product }).send()
    } catch (e) {
        next(e)
    }
}
const updateProduct = async (req, res, next) => {
    const { productId } = req.params
    const { sellerAccount } = req.user
    const updateItems = req.body
    try {
        if (req.image) updateItems.banner = req.image

        const product = await FindById(productId)
        console.log(sellerAccount)
        if (!product || product.supplier._id.toString() !== sellerAccount._id.toString())
            throw new BadRequestError('Only seller can update their existing product.')

        await destroy(product.banner.publicId) //destroying the current product banner
        const updatedProduct = await UpdateProduct(productId, updateItems)
        new ApiResponse(res).status(200).data({ updatedProduct }).send()
    } catch (e) {
        next(e)
    }
}
const deleteProduct = async (req, res, next) => {
    const { productId } = req.params
    const { sellerAccount } = req.user
    try {
        const product = await FindById(productId)
        if (!product || product.supplier._id.toString() !== sellerAccount._id.toString())
            throw new BadRequestError('Only seller can delete their existing product.')
        await destroy(product.banner.publicId) //destroying the product image
        await DeleteProduct(productId)
        await sellerRepository.RemoveProduct(sellerAccount._id, productId)
        new ApiResponse(res).status(200).msg('Product Deleted!').send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
}
