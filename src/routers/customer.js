const router = require('express').Router()

const {
    customerController: { addNewAddress, getProfile, addToCart, removeToCart },
} = require('../controllers')
const { Authentication } = require('../middlewares')
router.post('/customer/address', Authentication, addNewAddress)
router.get('/customer/profile', Authentication, getProfile)
router.delete('/customer/cart/:productId', Authentication, removeToCart)
router.post('/customer/cart', Authentication, addToCart)
module.exports = router
