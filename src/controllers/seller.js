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
            suplier: sellerAccount,
        }
        if (!req.image) throw new BadRequestError('Product image is required!')
        data.banner = req.image
        const product = await CreateProduct(data)
        await sellerRepository.AddProduct(sellerAccount, product)
        new ApiResponse(res).status(200).data({ product }).send()
    } catch (e) {
        next(e)
    }
}
const updateProduct = async (req, res, next) => {
    const { productId } = req.params
    const updateItems = req.body
    try {
        if (!req.image) throw new BadRequestError('Product image is required!')
        updateItems.banner = req.image

        const product = await FindById(productId)
        console.log(product)
        if (!product) throw new BadRequestError('No product found!')
        await destroy(product.banner.publicId) //destroying the current product banner
        const updatedProduct = await UpdateProduct(productId, updateItems)
        console.log(updatedProduct)
        new ApiResponse(res).status(200).data({ updatedProduct }).send()
    } catch (e) {
        next(e)
    }
}
const deleteProduct = async (req, res, next) => {
    const { id } = req.params
    try {
        await DeleteProduct(id)
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
