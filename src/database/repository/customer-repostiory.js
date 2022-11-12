const Customer = require('../models/Customer')

const Address = require('../models/Address')
const { APIError, STATUS_CODES } = require('../../helpers/AppError')
class CustomerRepository {
    async Create(object) {
        try {
            return await Customer.create(object)
        } catch {
            throw new APIError(
                'API Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to create Customer!'
            )
        }
    }

    async FindById(id) {
        try {
            return await Customer.findById(id)
                .select('+password, +salt')
                .populate('address')
                .populate('cart.product')
        } catch {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to find Customer!')
        }
    }
    async FindByEmail(email) {
        try {
            return await Customer.findOne({ email }).select('+password +salt')
        } catch {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to find Customer!')
        }
    }

    async CreateAddress(object) {
        try {
            const { id, street, postalCode, city, country } = object
            const customer = await this.FindById(id)
            if (!customer) return undefined
            const address = new Address({
                street,
                postalCode,
                city,
                country,
            })
            await address.save()
            return await Customer.findOneAndUpdate(
                { _id: id },
                {
                    $push: {
                        address: address._id,
                    },
                },
                {
                    new: true,
                }
            )
        } catch {
            throw new APIError(
                'API Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to create Address!'
            )
        }
    }
    
      async AddToCart(object) {
        const { id, product, quantity } = object
        try {
            const customer = await Customer.findById(id).populate('cart.product')
            const cart = customer.cart
            if (cart.findIndex((cart) => cart.product._id.toString() === product.toString()) !== -1)
                throw new Error('Product Already exist!')
            return await Customer.findOneAndUpdate(
                { _id: id },
                {
                    $push: {
                        cart: {
                            product,
                            unit: quantity,
                        },
                    },
                },
                {
                    new: true,
                }
            )
        } catch (e) {
            throw new APIError(
                'Api Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to add item to Cart!'
            )
        }
    }
    
     async RemoveToCart(id, productId) {
        try {
            const customer = await Customer.findById(id)
            const cart = customer.cart
            if (cart.findIndex((ProductId) => ProductId.toString() === productId.toString()) < 0)
                throw new Error('product does not exist in cart!')
            await Customer.findOneAndUpdate(
                { _id: id },
                {
                    $pull: {
                        cart: productId,
                    },
                },
                { new: true }
            )
        } catch (e) {
            console.log(e)
            throw new APIError('Api Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to remove item!')
        }
    }
}

module.exports = CustomerRepository
