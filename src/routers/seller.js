const router = require('express').Router()
const {
    sellerController: {
        createProduct,
        updateProduct,
        deleteProduct,
        completeOrder,
        getAllOrders,
        getMonthlyIncome,
        getStockStatus,
    },
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
const {
    validators: { validator, src },
    FileUpload: { imageUpload: imageUploader },
} = require('../helpers')

router.post(
    '/products',
    Authentication,
    verifyRole(roles.Seller, roles.Admin, roles.Customer),
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
    verifyRole(roles.Admin, roles.Seller, roles.Customer),
    validator(checkOrder, src.PARAM),
    completeOrder
)
router.get('/products/stock/status', Authentication, getStockStatus)
router.get(
    '/orders/monthly-income',
    Authentication,
    verifyRole(roles.Seller, roles.Admin),
    getMonthlyIncome
)

router.get('/orders', Authentication, verifyRole(roles.Seller, roles.Admin), getAllOrders)
module.exports = router
