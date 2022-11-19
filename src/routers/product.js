const router = require('express').Router()
const {
    productController: { getProducts, findProduct, findByCategory, findSelectedProducts },
} = require('../controllers')
router.get('/products', getProducts)
router.get('/products/:id', findProduct)
router.get('/products/category/:type', findByCategory)
router.post('/products/ids', findSelectedProducts)
module.exports = router
