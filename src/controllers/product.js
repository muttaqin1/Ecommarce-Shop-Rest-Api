const { ProductRepository } = require('../database')
const { Products, FindById, FindByCategory, FindSelectedProducts } = new ProductRepository()

const ApiResponse = require('../helpers/ApiResponse')

const getProducts = async (req, res, next) => {
    try {
        const products = await Products()
        new ApiResponse(res).status(200).data({ products }).send()
    } catch (e) {
        next(e)
    }
}

const findProduct = async (req, res, next) => {
    const { id } = req.params
    try {
        const product = await FindById(id)
        if (!product) throw new Error('unable to find product')
        new ApiResponse(res).status(200).data({ product }).send()
    } catch (e) {
        next(e)
    }
}

const findByCategory = async (req, res, next) => {
    try {
        const products = await FindByCategory(req.params.type)
        if (!products) throw new Error('no products found')
        new ApiResponse(res).status(200).data({ products }).send()
    } catch (e) {
        next(e)
    }
}
const findSelectedProducts = async (req, res, next) => {
    const { ids } = req.body
    try {
        const products = await FindSelectedProducts(ids)
        new ApiResponse(res).status(200).data({ products }).send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getProducts,
    findProduct,
    findByCategory,
    findSelectedProducts,
}
