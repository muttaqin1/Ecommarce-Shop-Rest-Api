const router = require('express').Router()
const {
    stripeController: { payment },
} = require('../controllers')
const { Authentication } = require('../middlewares')

const {
    validators: { validator, stripePayload },
} = require('../helpers')

router.post('/payment', Authentication, validator(stripePayload), payment)

module.exports = router
