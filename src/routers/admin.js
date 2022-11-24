const router = require('express').Router()
const {
    Authentication,
    roleAuth: { roles, verifyRole },
} = require('../middlewares')
const {
    adminController: {
        acceptSellerRequest,
        rejectSellerRequest,
        removeSeller,
        getSellerList,
        getSellerRequests,
    },
} = require('../controllers')
const { checkSellerId, sellerId } = require('./schemas/adminSchema')
const { validator, src } = require('../helpers/validators')
router.put(
    '/admin/seller-request/:sellerRequestId',
    Authentication,
    verifyRole(roles.admin),
    validator(checkSellerId, src.PARAM),
    acceptSellerRequest
)
router.delete(
    '/admin/seller-request/:sellerRequestId',
    Authentication,
    verifyRole(roles.admin),
    validator(checkSellerId, src.PARAM),
    rejectSellerRequest
)
router.delete(
    '/admin/seller-remove/:sellerId',
    Authentication,
    verifyRole(roles.admin),
    validator(sellerId, src.PARAM),
    removeSeller
)
router.get('/admin/seller-request', Authentication, verifyRole(roles.admin), getSellerRequests),
    router.get('/admin/sellers', Authentication, verifyRole(roles.admin), getSellerList)
module.exports = router
