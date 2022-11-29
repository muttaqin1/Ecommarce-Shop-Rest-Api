const router = require('express').Router()

const {
    customerController: {
        addNewAddress,
        getProfile,
        addToCart,
        removeToCart,
        deleteAddress,
        getAllAddress,
        changeName,
        getCart,
        getWishlist,
        addToWishlist,
        removeToWishlist,
        changeAvatar,
        getOrders,
    },
} = require('../controllers')
const { Authentication } = require('../middlewares')
const {
    addAddress,
    removeAddress,
    changename,
    AddToCart,
    RemoveToCart,
    validateProduct,
    validateImage,
} = require('./schemas/customerSchema')

const imageUpload = require('../helpers/fileUpload/imageUpload')
const { validator, src } = require('../helpers/validators')

router.post('/customer/address', Authentication, validator(addAddress), addNewAddress)
router.delete(
    '/customer/address/:address',
    Authentication,
    validator(removeAddress, src.PARAM),
    deleteAddress
)
router.put('/customer/profile/change-name', Authentication, validator(changename), changeName)
router.put(
    '/customer/profile/change-avatar',
    Authentication,
    imageUpload('avatar', 'avatars'),
    validator(validateImage, src.IMAGE),
    changeAvatar
)
router.get('/customer/address', Authentication, getAllAddress)
router.get('/customer/profile', Authentication, getProfile)

router.delete(
    '/customer/cart/:productId',
    Authentication,
    validator(RemoveToCart, src.PARAM),
    removeToCart
)
router.post('/customer/cart', Authentication, validator(AddToCart), addToCart)
router.get('/customer/cart', Authentication, getCart)
router.post(
    '/customer/wishlist/:productId',
    Authentication,
    validator(validateProduct, src.PARAM),
    addToWishlist
)
router.delete(
    '/customer/wishlist/:productId',
    Authentication,
    validator(validateProduct, src.PARAM),
    removeToWishlist
)
router.get('/customer/wishlist', Authentication, getWishlist)
router.get('/customer/order', Authentication, getOrders)
module.exports = router
