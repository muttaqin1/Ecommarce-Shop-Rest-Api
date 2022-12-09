const { CustomerRepository, IssueRepository } = require('../database')
const ApiResponse = require('../helpers/ApiResponse')
const customerRepository = new CustomerRepository()
const issueRepository = new IssueRepository()
const { BadRequestError } = require('../helpers/AppError')

const addNewAddress = async (req, res, next) => {
    const { _id } = req.user
    try {
        const data = {
            ...req.body,
            id: _id,
        }
        const updatedCustomer = await customerRepository.CreateAddress(data)
        if (!updatedCustomer) throw new BadRequestError('failed to update Customer!')

        new ApiResponse(res).status(200).data({ address: updatedCustomer.address }).send()
    } catch (e) {
        next(e)
    }
}
const deleteAddress = async (req, res, next) => {
    const { address } = req.params
    const { _id } = req.user
    try {
        const doesAddressExist = await customerRepository.GetSingleAddress(_id, address)
        if (!doesAddressExist) throw new BadRequestError('Invalid address.')
        const { address: updatedAddress } = await customerRepository.DeleteAddress(_id, address)
        new ApiResponse(res).status(200).data({ address: updatedAddress }).send()
    } catch (e) {
        next(e)
    }
}
const getAllAddress = async (req, res, next) => {
    const { _id } = req.user
    try {
        const { address } = await customerRepository.GetAllAddress(_id)
        new ApiResponse(res).status(200).data({ address }).send()
    } catch (e) {
        next(e)
    }
}
const getProfile = async (req, res, next) => {
    try {
        const { _id } = req.user
        const profile = await customerRepository.FindById(_id, '-password -salt')
        new ApiResponse(res).status(200).data({ profile }).send()
    } catch (e) {
        next(e)
    }
}
const addToCart = async (req, res, next) => {
    const { product, quantity } = req.body
    const data = {
        id: req.user._id,
        product,
        quantity,
    }
    try {
        const { cart } = await customerRepository.FindById(req.user._id)
        if (
            cart.findIndex(
                (cart) => cart.product._id.toString() === req.body.product.toString()
            ) !== -1
        )
            throw new BadRequestError('Item is already in your cart.')
        const updatedCustomer = await customerRepository.AddToCart(data)
        new ApiResponse(res).status(200).data({ cart: updatedCustomer.cart }).send()
    } catch (e) {
        next(e)
    }
}

const removeToCart = async (req, res, next) => {
    const { _id } = req.user
    const { productId } = req.params
    try {
        const { cart } = await customerRepository.FindById(_id)
        if (cart.findIndex((cart) => cart.product._id.toString() === productId.toString()) > 0)
            throw new BadRequestError('product does not exist in cart!')

        const updatedCustomer = await customerRepository.RemoveToCart(_id, productId)
        new ApiResponse(res).status(200).data({ cart: updatedCustomer.cart }).send()
    } catch (e) {
        next(e)
    }
}

const changeName = async (req, res, next) => {
    const { name } = req.body
    const { _id } = req.user
    try {
        const customer = await customerRepository.ChangeName(_id, name)
        new ApiResponse(res).status(200).data({ customer }).send()
    } catch (e) {
        next(e)
    }
}
const changeAvatar = async (req, res, next) => {
    const { _id } = req.user
    const { image } = req
    try {
        if (!image) throw new BadRequestError('Image not found!')
        await customerRepository.changeAvatar(_id, image)
        new ApiResponse(res).status(200).msg('Avatar changed successfuly!').send()
    } catch (e) {
        next(e)
    }
}
const getCart = async (req, res, next) => {
    const { _id } = req.user
    try {
        const { cart, totalPrice } = await customerRepository.GetCart(_id)
        new ApiResponse(res).status(200).data({ totalPrice, cart }).send()
    } catch (e) {
        next(e)
    }
}
const addToWishlist = async (req, res, next) => {
    const { _id } = req.user
    const { productId } = req.params
    try {
        await customerRepository.AddToWishlist(_id, productId)
        new ApiResponse(res).status(200).msg('Item added to wishlist.').send()
    } catch (e) {
        next(e)
    }
}
const removeToWishlist = async (req, res, next) => {
    const { _id } = req.user
    const { productId } = req.params
    try {
        await customerRepository.RemoveToWishlist(_id, productId)
        new ApiResponse(res).status(200).msg('Item removed to wishlist.').send()
    } catch (e) {
        next(e)
    }
}
const getWishlist = async (req, res, next) => {
    const { _id } = req.user
    try {
        const wishlist = await customerRepository.GetWishlist(_id)
        new ApiResponse(res).status(200).data({ wishlist }).send()
    } catch (e) {
        next(e)
    }
}
const getOrders = async (req, res, next) => {
    const { _id } = req.user
    try {
        const orders = await customerRepository.GetOrders(_id)
        new ApiResponse(res).status(200).data({ orders }).send()
    } catch (e) {
        next(e)
    }
}

const changePhoneNumber = async (req, res, next) => {
    const { phone } = req.body
    const { _id } = req.user
    try {
        await customerRepository.ChangePhoneNumber(_id, phone)
        new ApiResponse(res).status(200).msg('Number changed successfuly!').send()
    } catch (e) {
        next(e)
    }
}
const getPurchaseHistory = async (req, res, next) => {
    const { purchaseHistory } = req.user
    try {
        const phistory = await customerRepository.GetPurchaseHistory(purchaseHistory)
        new ApiResponse(res).status(200).data({ purchaseHistory: phistory }).send()
    } catch (e) {
        next(e)
    }
}
const reportAProblem = async (req, res, next) => {
    const { title, body } = req.body
    const { email } = req.user
    try {
        const data = { title, email, body }
        const Issue = await issueRepository.Create(data)
        new ApiResponse(res).status(200).data({ Issue }).send()
    } catch (e) {
        next(e)
    }
}
module.exports = {
    addNewAddress,
    getProfile,
    addToCart,
    removeToCart,
    getAllAddress,
    deleteAddress,
    changeName,
    getCart,
    getWishlist,
    addToWishlist,
    removeToWishlist,
    changeAvatar,
    getOrders,
    changePhoneNumber,
    getPurchaseHistory,
    reportAProblem,
}
