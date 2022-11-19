const router = require('express').Router()
const {
    Authentication,
    roleAuth: { roles, verifyRole },
} = require('../middlewares')
const {
    adminController: { acceptSellerRequest },
} = require('../controllers')
const { checkSellerId } = require('./schemas/adminSchema')
const { validator, src } = require('../helpers/validators')
router.put(
    '/admin/seller-request/:sellerRequestId',
    Authentication,
    verifyRole(roles.admin),
    validator(checkSellerId, src.PARAM),
    acceptSellerRequest
)

module.exports = router
