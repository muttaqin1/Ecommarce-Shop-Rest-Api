const router = require('express').Router()
const {
    sellerController: { createProduct, updateProduct, deleteProduct, completeOrder, getAllOrders },
} = require('../controllers')
const {
    Authentication,
    roleAuth: { verifyRole, roles },
} = require('../middlewares')
const {
    CreateProduct,
    UpdateProduct,
    checkProductId,
    checkOrder,
} = require('./schemas/sellerSchema')
const { validator, src } = require('../helpers/validators')
const imageUploader = require('../helpers/fileUpload/imageUpload')
router.post(
    '/products',
    Authentication,
    verifyRole(roles.Seller, roles.Admin),
    imageUploader('Banner', 'Banners'),
    validator(CreateProduct),
    createProduct
)
router.put(
    '/products/:productId',
    Authentication,
    verifyRole(roles.Admin, roles.Seller),
    imageUploader('Banner', 'Banners'),
    validator(UpdateProduct),
    updateProduct
)
router.delete(
    '/products/:productId',
    Authentication,
    verifyRole(roles.Seller, roles.Admin),
    validator(checkProductId, src.PARAM),
    deleteProduct
)
router.put(
    '/orders/:orderId',
    Authentication,
    verifyRole(roles.Admin, roles.Seller),
    validator(checkOrder, src.PARAM),
    completeOrder
)
router.get('/orders', Authentication, verifyRole(roles.Seller, roles.Admin), getAllOrders)
module.exports = router
