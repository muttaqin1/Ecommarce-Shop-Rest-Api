const { STATUS_CODES, APIError } = require('../../helpers/AppError')

const Product = require('../models/Product')

class ProductRepository {
    async CreateProduct(object) {
        try {
            return await Product.create(object)
        } catch {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to create Product!'
            )
        }
    }
    async Products() {
        try {
            return await Product.find()
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to find Product!')
        }
    }

    async FindById(id, select = '') {
        try {
            return await Product.findById(id).select(select)
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to find Product!')
        }
    }
    async FindByName(name) {
        try {
            return await Product.find({ name })
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to find Product!')
        }
    }

    async FindByCategory(category) {
        try {
            return await Product.find({ category })
        } catch {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category')
        }
    }

    async DeleteProduct(id) {
        try {
            return await Product.deleteOne({ _id: id })
        } catch {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to delete product')
        }
    }

    async FindSelectedProducts(ids) {
        try {
            return await Product.find({ _id: { $in: ids } })
        } catch {
            throw new APIError(
                'API Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to find product selected products'
            )
        }
    }
    async UpdateProduct(productId, object) {
        try {
            return await Product.findOneAndUpdate({ _id: productId }, object, {
                new: true,
            })
        } catch {
            throw new APIError(
                'API Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to update product!'
            )
        }
    }
    async AddReview(productId, object) {
        try {
            return await Product.findOneAndUpdate(
                { _id: productId },
                {
                    $push: {
                        reviews: object,
                    },
                },
                { new: true }
            )
        } catch {
            throw new APIError(
                'API Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to update product!'
            )
        }
    }

    async UpdateReview(productId, { customer: customerId, text, rating }) {
        try {
            const product = await Product.findById(productId)
            const { reviews } = product
            const index = reviews?.findIndex(
                ({ customer }) => customer.toString() === customerId.toString()
            )
            if (text) reviews[index].text = text
            if (rating) reviews[index].rating = rating
            return await product.save()
        } catch (e) {
            console.log(e)
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to update review!')
        }
    }

    async DeleteReview(productId, customerId) {
        try {
            const product = await Product.findById(productId)
            const { reviews } = product
            const index = reviews?.findIndex(
                ({ customer }) => customer.toString() === customerId.toString()
            )
            reviews.splice(index, 1)
            return await product.save()
        } catch {
            throw new APIError(
                'API Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Failed to delete product!'
            )
        }
    }
}
module.exports = ProductRepository
