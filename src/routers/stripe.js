const router = require('express').Router()
const {
    stripeController: { payment },
} = require('../controllers')
const { Authentication } = require('../middlewares')

router.post('/payment', Authentication, payment)

module.exports = router
