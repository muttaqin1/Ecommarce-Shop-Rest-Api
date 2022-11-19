const router = require('express').Router()
const {
    sellerController: { createProduct, deleteProduct },
} = require('../controllers')
const {
    Authentication,
    roleAuth: { roles, verifyRole },
} = require('../middlewares')
const { validator, src } = require('../helpers/validators')

router.post('/products', Authentication, verifyRole(roles.seller), createProduct)

module.exports = router
