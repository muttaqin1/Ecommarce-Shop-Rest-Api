const router = require('express').Router()
const { Authentication } = require('../middlewares')
const {
    productController: {
        getProducts,
        findProduct,
        findByCategory,
        findSelectedProducts,
        createReview,
        updateReview,
        deleteReview,
    },
} = require('../controllers')
const { checkProductId, CreateReview, UpdateReview } = require('./schemas/productSchema')
const {
    validators: { validator, src },
} = require('../helpers')

router.get('/products', getProducts)
router.get('/products/:id', findProduct)
router.get('/products/category/:type', findByCategory)
router.post('/products/ids', findSelectedProducts)
router.post(
    '/products/reviews/:productId',
    Authentication,
    validator(CreateReview),
    validator(checkProductId, src.PARAM),
    createReview
)
router.put(
    '/products/reviews/:productId',
    Authentication,
    validator(UpdateReview),
    validator(checkProductId, src.PARAM),
    updateReview
)
router.delete(
    '/products/reviews/:productId',
    Authentication,
    validator(checkProductId, src.PARAM),
    deleteReview
)
module.exports = router
