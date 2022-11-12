const router = require('express').Router()

const {
    customerController: { addNewAddress, getProfile, addToCart, removeToCart },
} = require('../controllers')
const { Authentication } = require('../middlewares')

router.use(Authentication) //Below all the routes are protected
router.post('/customer/address', addNewAddress)
router.get('/customer/profile', getProfile)
router.delete('/customer/cart/:productId', removeToCart)
router.post('/customer/cart', addToCart)
module.exports = router
