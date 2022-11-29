const { CustomerRepository } = require('../database')
const ApiResponse = require('../helpers/ApiResponse')
const customerRepository = new CustomerRepository()
const { BadRequestError } = require('../helpers/AppError')

const addNewAddress = async (req, res, next) => {
    try {
        const data = {
            ...req.body,
            id: req.user._id,
        }
        const updatedCustomer = await customerRepository.CreateAddress(data)
        if (!updatedCustomer) throw new BadRequestError('failed to update Customer!')

        new ApiResponse(res).status(200).data({ address: updatedCustomer.address }).send()
    } catch (e) {
        next(e)
    }
}
const deleteAddress = async (req, res, next) => {
    const addressToDelete = req.params.address
    const { _id } = req.user
    try {
        const doesAddressExist = await customerRepository.GetSingleAddress(_id, addressToDelete)
        if (!doesAddressExist) throw new BadRequestError('Invalid address.')
        const { address } = await customerRepository.DeleteAddress(_id, addressToDelete)
        new ApiResponse(res).status(200).data({ address }).send()
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
    const data = {
        id: req.user._id,
        ...req.body,
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
        if (Object.keys(image).length <= 0) throw new BadRequestError('Image not found!')
        await customerRepository.changeAvatar(_id, image)
        new ApiResponse(res).status(200).msg('Avatar changed successfuly!')
    } catch (e) {
        next(e)
    }
}
const getCart = async (req, res, next) => {
    let totalPrice = 0
    const { _id } = req.user
    try {
        const { cart } = await customerRepository.FindById(_id)
        cart.forEach(
            ({ product: { price, unit } }) => (totalPrice += parseInt(price) * parseInt(unit))
        )
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
        if (orders?.length <= 0)
            new ApiResponse(res).status(200).msg("You don't have any orders").send()

        new ApiResponse(res).status(200).data({ orders }).send()
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
}
