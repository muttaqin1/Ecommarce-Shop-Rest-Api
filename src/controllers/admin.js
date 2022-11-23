const { SellerRepository, CustomerRepository } = require('../database')
const sellerRepository = new SellerRepository()
const customerRepository = new CustomerRepository()
const { APIError, STATUS_CODES } = require('../helpers/AppError')
const {
    sendMail,
    MailBody: { acceptSellerReq, rejectSellerReq },
} = require('../helpers/sendMail')
const ApiResponse = require('../helpers/ApiResponse')

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
        new ApiResponse(res).status(200).msg('Seller request rejected!').send()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    acceptSellerRequest,
    rejectSellerRequest,
}
