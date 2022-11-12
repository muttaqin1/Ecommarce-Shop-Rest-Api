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

router.use(Authentication) //below all the routes are protected

router.post('/products/create', createProduct)
router.get('/products', getProducts)
router.get('/products/:id', findProduct)
router.get('/products/category/:type', findByCategory)
router.delete('/products/:id', deleteProduct)
router.post('/products/ids', findSelectedProducts)
module.exports = router
