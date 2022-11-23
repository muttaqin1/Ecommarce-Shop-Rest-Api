const SellerProfile = require('../models/SellerProfile')
const { STATUS_CODES, APIError } = require('../../helpers/AppError')
const Customer = require('../models/Customer')
class SellerRepostiory {
    async Create(object) {
        try {
            const sellerProfile = await SellerProfile.create(object)
            await Customer.updateOne(
                {
                    _id: object.customerId,
                },
                { sellerAccount: sellerProfile._id }
            )
            return sellerProfile
        } catch {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Failed to create seller profile!'
            )
        }
    }
    async PendingSellerRequests() {
        try {
            return await SellerProfile.find({ sellerVerified: true }).populate('products')
        } catch {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Failed to get seller list!'
            )
        }
    }
    async GetSellerRequest() {
        try {
            return await SellerRepostiory.find({ sellerVerified: false })
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR)
        }
    }
    async RejectSellerRequest(requestId) {
        try {
            return await SellerProfile.deleteOne({ _id: requestId })
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to reject seller!')
        }
    }
    async FindById(sellerId) {
        try {
            return await SellerProfile.findById(sellerId).populate('customerId')
        } catch {
            new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to find seller!')
        }
    }
    async AcceptSellerRequest(sellerId) {
        try {
            const seller = await SellerProfile.updateOne(
                { _id: sellerId },
                {
                    sellerVerified: true,
                }
            )
            await Customer.updateOne(
                { customerId: seller.customerId },
                {
                    seller: true,
                    role: 'SELLER',
                    sellerAccount: seller._id,
                }
            )
            return true
        } catch {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Failed to accept seller request'
            )
        }
    }
    async RejectSellerRequest(sellerId) {
        try {
            await Customer.updateOne(
                { sellerAccount: sellerId },
                {
                    $unset: {
                        sellerAccount: 1,
                    },
                }
            )

            return await SellerProfile.findOneAndDelete({ _id: sellerId })
        } catch {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Unable to reject seller request!'
            )
        }
    }
    async RemoveSeller(sellerId) {
        try {
            await Customer.updateOne(
                { sellerAccount: sellerId },
                {
                    seller: false,
                    role: 'CUSTOMER',
                }
            )

            await SellerProfile.deleteOne({ _id: sellerId })
            return true
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to remove seller!')
        }
    }
    async AddProduct(sellerId, productId) {
        await SellerProfile.updateOne(
            { _id: sellerId },
            {
                $push: {
                    products: productId,
                },
            }
        )
    }
    async RemoveProduct(sellerId, productId) {
        await SellerProfile.updateOne(
            { _id: sellerId },
            {
                $pull: {
                    products: productId,
                },
            }
        )
    }
}
module.exports = SellerRepostiory
