const { ProductRepository, SellerRepository } = require('../database')
const { CreateProduct, DeleteProduct } = new ProductRepository()
const sellerRepository = new SellerRepository()
const createProduct = async (req, res, next) => {
    const {
        sellerAccount: { _id },
    } = req.user
    console.log(req.user)
    const { name, description, type, unit, price } = req.body
    try {
        const data = {
            name,
            desc: description,
            type,
            unit,
            price,
            suplier: _id,
        }
        if (req.image) data.banner = req.image
        const product = await CreateProduct(data)
        await sellerRepository.AddProducts(_id, product)
        new ApiResponse(res).status(200).data({ product }).send()
    } catch (e) {
        next(e)
    }
}
const updateProduct = async (req, res, next) => {
    const { name, description, type, unit, price, available } = req.body
    try {
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
}
