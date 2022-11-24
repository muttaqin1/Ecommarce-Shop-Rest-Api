const Customer = require('../models/Customer')

const Address = require('../models/Address')
const { APIError, STATUS_CODES } = require('../../helpers/AppError')
class CustomerRepository {
    async Create(object) {
        try {
            return await Customer.create(object)
        } catch (e) {
            console.log(e)
            throw new APIError(
                'API Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to create Customer!'
            )
        }
    }

    async FindById(id, select = '+password +salt') {
        try {
            const customer = await Customer.findById(id)
            let populateString = 'cart.product wishlist address'
            if (customer.sellerAccount?._id && customer.seller) populateString += ' sellerAccount'
            return await Customer.findById(id).select(select).populate(populateString)
        } catch (e) {
            console.log(e)
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to find Customer!')
        }
    }
    async FindBySellerId(sellerId) {
        try {
            return await Customer.findOne({ sellerAccount: sellerId })
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to find Customer!')
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
            ).populate('address')
        } catch {
            throw new APIError(
                'API Error',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to create Address!'
            )
        }
    }
    async GetAllAddress(id) {
        try {
            return await this.FindById(id)
        } catch (e) {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to get address!')
        }
    }

    async GetSingleAddress(userId, addressId) {
        try {
            const { address } = await this.FindById(userId)
            return await address.find((address) => address._id.toString() === addressId.toString())
        } catch (e) {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Unable to get address!')
        }
    }

    async DeleteAddress(userId, address) {
        try {
            return await Customer.findOneAndUpdate(
                { _id: userId },
                {
                    $pull: {
                        address: address,
                    },
                },
                {
                    new: true,
                }
            ).populate('address')
        } catch (e) {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to delete address!'
            )
        }
    }

    async AddToCart(object) {
        const { id, product, quantity } = object
        try {
            const cartItem = {
                product,
                unit: quantity,
            }
            return await Customer.findOneAndUpdate(
                { _id: id },
                {
                    $push: {
                        cart: cartItem,
                    },
                },
                {
                    new: true,
                }
            ).populate('cart.product')
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
            const customer = await this.FindById(id)
            const cart = customer.cart
            const index = cart.findIndex(
                (cart) => cart.product._id.toString() === productId.toString()
            )
            cart.splice(index, 1)
            return await customer.save()
        } catch (e) {
            throw new APIError('Api Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to remove item!')
        }
    }
    async ChangePassword(id, pass, salt) {
        return await Customer.updateOne(
            { _id: id },
            {
                password: pass,
                salt,
            }
        )
    }
    async ChangeName(userId, name) {
        try {
            return await Customer.findOneAndUpdate(
                { _id: userId },
                {
                    name,
                },
                { new: true }
            )
        } catch (e) {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to change name!')
        }
    }
    async ChangeAvatar(userId, avatar) {
        try {
            return await Customer.findOneAndUpdate(
                { _id: userId },
                {
                    avatar,
                }
            )
        } catch (e) {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to change Avatar!')
        }
    }
    async AddToWishlist(userId, productId) {
        try {
            return await Customer.findOneAndUpdate(
                { _id: userId },
                {
                    $push: {
                        wishlist: productId,
                    },
                },
                {
                    new: true,
                }
            ).populate('wishlist')
        } catch (e) {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Failed to add to wishlist!'
            )
        }
    }
    async RemoveToWishlist(userId, productId) {
        try {
            return await Customer.findOneAndUpdate(
                { _id: userId },
                {
                    $pull: {
                        wishlist: productId,
                    },
                }
            ).populate('wishlist')
        } catch (e) {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Failed to remove to wishlist!'
            )
        }
    }

    async GetWishlist(userId) {
        try {
            const { wishlist } = await this.FindById(userId)
            return wishlist
        } catch (e) {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to get wishlist!')
        }
    }
}

module.exports = CustomerRepository
