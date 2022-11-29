const router = require('express').Router()
const {
    orderController: { createOrder, cancelOrder },
} = require('../controllers')
const { Authentication } = require('../middlewares')

router.post('/order', Authentication, createOrder)
router.delete('/order/:orderId', Authentication, cancelOrder)

module.exports = router
