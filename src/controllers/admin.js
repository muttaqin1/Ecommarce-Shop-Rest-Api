const { SellerRepository, CustomerRepository } = require('../database')
const sellerRepository = new SellerRepository()
const customerRepository = new CustomerRepository()
const { APIError, STATUS_CODES, BadRequestError } = require('../helpers/AppError')
const {
    sendMail,
    MailBody: { acceptSellerReq, rejectSellerReq },
} = require('../helpers/sendMail')
const ApiResponse = require('../helpers/ApiResponse')

const getSellerRequests = async (req, res, next) => {
    try {
        const requests = await sellerRepository.GetSellerRequests()
        new ApiResponse(res).status(200).data({ requests }).send()
    } catch (e) {
        next(e)
    }
}
const getSellerList = async (req, res, next) => {
    try {
        const sellerList = await sellerRepository.Sellers()
        new ApiResponse(res).status(200).data({ sellerList }).send()
    } catch (e) {
        next(e)
    }
}

const acceptSellerRequest = async (req, res, next) => {
    const { sellerRequestId } = req.params
    try {
        const {
            customerId: { name, email },
        } = await sellerRepository.FindById(sellerRequestId)
        const mailSend = await sendMail(acceptSellerReq(name, email))
        if (!mailSend)
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to send Mail')
        await sellerRepository.AcceptSellerRequest(sellerRequestId)
        new ApiResponse(res).status(200).msg('Seller request accepted.').send()
    } catch (e) {
        next(e)
    }
}
const rejectSellerRequest = async (req, res, next) => {
    const { sellerRequestId } = req.params
    try {
        const {
            customerId: { name, email },
        } = await sellerRepository.FindById(sellerRequestId)
        const mailSend = await sendMail(rejectSellerReq(name, email))
        if (!mailSend)
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to send Mail')

        await sellerRepository.RejectSellerRequest(sellerRequestId)
        new ApiResponse(res).status(200).msg('Seller request rejected.').send()
    } catch (e) {
        next(e)
    }
}

const removeSeller = async (req, res, next) => {
    const { sellerId } = req.params
    try {
        const seller = await sellerRepository.FindById(sellerId)
        if (!seller) throw new BadRequestError('No seller found!')
        await sellerRepository.RemoveSeller(sellerId)
        new ApiResponse(res).status(200).msg('Seller account removed.').send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    acceptSellerRequest,
    rejectSellerRequest,
    removeSeller,
    getSellerList,
    getSellerRequests,
}
