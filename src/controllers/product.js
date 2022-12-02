const { ProductRepository } = require('../database')
const productRepository = new ProductRepository()
const { BadRequestError } = require('../helpers/AppError')
const ApiResponse = require('../helpers/ApiResponse')

const getProducts = async (req, res, next) => {
    try {
        const products = await productRepository.Products()
        new ApiResponse(res).status(200).data({ products }).send()
    } catch (e) {
        next(e)
    }
}

const findProduct = async (req, res, next) => {
    const { name } = req.params
    try {
        const product = await productRepository.FindByName(name)
        if (!product) throw new Error('unable to find product')
        new ApiResponse(res).status(200).data({ product }).send()
    } catch (e) {
        next(e)
    }
}

const findByCategory = async (req, res, next) => {
    const { category } = req.params
    try {
        const products = await productRepository.FindByCategory(category)
        if (!products) throw new Error('no products found')
        new ApiResponse(res).status(200).data({ products }).send()
    } catch (e) {
        next(e)
    }
}
const findSelectedProducts = async (req, res, next) => {
    const { ids } = req.body
    try {
        const products = await productRepository.FindSelectedProducts(ids)
        new ApiResponse(res).status(200).data({ products }).send()
    } catch (e) {
        next(e)
    }
}

const createReview = async (req, res, next) => {
    const { productId } = req.params
    const { rating, text } = req.body
    try {
        const data = {
            rating,
            customer: req.user._id,
            text,
        }
        const { reviews } = await productRepository.FindById(productId)
        const exist = reviews?.find(
            ({ customer }) => customer?.toString() === req.user._id?.toString()
        )
        if (exist) throw new BadRequestError('You have already reviewed this product.')
        const product = await productRepository.AddReview(productId, data)
        new ApiResponse(res).status(200).data({ review: product.reviews }).send()
    } catch (e) {
        next(e)
    }
}

const updateReview = async (req, res, next) => {
    const { productId } = req.params
    const { rating, text } = req.body
    const { _id } = req.user
    try {
        const data = {
            rating,
            customer: _id,
            text,
        }
        const { reviews } = await productRepository.FindById(productId)
        const exist = reviews?.find(({ customer }) => customer?.toString() === _id?.toString())
        if (!exist) throw new BadRequestError("You don't have any review to update!")
        const product = await productRepository.UpdateReview(productId, data)
        new ApiResponse(res).status(200).data({ review: product.reviews }).send()
    } catch (e) {
        next(e)
    }
}
const deleteReview = async (req, res, next) => {
    const { productId } = req.params
    const { _id } = req.user
    try {
        const { reviews } = await productRepository.FindById(productId)
        const exist = reviews?.find(({ customer }) => customer?.toString() === _id?.toString())
        if (!exist) throw new BadRequestError("You don't have any review to delete!")
        await productRepository.DeleteReview(productId, _id)
        new ApiResponse(res).status(200).msg('review deleted!').send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getProducts,
    findProduct,
    findByCategory,
    findSelectedProducts,
    createReview,
    updateReview,
    deleteReview,
}
