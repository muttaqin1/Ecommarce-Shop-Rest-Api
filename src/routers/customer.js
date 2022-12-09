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
        changePhoneNumber,
        getPurchaseHistory,
        reportAProblem,
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
    validatePhoneNo,
    ReportAProblem,
} = require('./schemas/customerSchema')
const {
    validators: { src, validator },
    FileUpload: { imageUpload },
} = require('../helpers')

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
router.put('/customer/phone', Authentication, validator(validatePhoneNo), changePhoneNumber)
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
router.get('/customer/purchase-history', Authentication, getPurchaseHistory)

router.get('/customer/wishlist', Authentication, getWishlist)
router.get('/customer/orders', Authentication, getOrders)
router.post('/customer/report-problem', Authentication, validator(ReportAProblem), reportAProblem)
module.exports = router
