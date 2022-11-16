const router = require('express').Router()
const {
    productController: {
        createProduct,
        getProducts,
        findProduct,
        deleteProduct,
        findByCategory,
        findSelectedProducts,
    },
} = require('../controllers')
const { Authentication } = require('../middlewares')
const {
    roleAuth: { roles, verifyRole },
} = require('../middlewares')

router.post('/products/create', Authentication, createProduct)
router.get('/products', getProducts)
router.get('/products/:id', findProduct)
router.get('/products/category/:type', findByCategory)
router.delete('/products/:id', Authentication, deleteProduct)
router.post('/products/ids', findSelectedProducts)
module.exports = router
