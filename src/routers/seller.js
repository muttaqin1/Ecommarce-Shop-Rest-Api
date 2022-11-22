const router = require('express').Router()
const {
    sellerController: { createProduct, updateProduct, deleteProduct },
} = require('../controllers')
const {
    Authentication,
    roleAuth: { roles, verifyRole },
} = require('../middlewares')
const { CreateProduct, UpdateProduct } = require('./schemas/sellerSchema')
const { validator, src } = require('../helpers/validators')
const imageUploader = require('../helpers/fileUpload/imageUpload')

router.post(
    '/products',
    Authentication,
    verifyRole(roles.seller),
    imageUploader('banner', 'banners'),
    validator(CreateProduct),
    createProduct
)
router.put(
    '/products/:productId',
    Authentication,
    verifyRole(roles.seller),
    imageUploader('banner', 'banners'),
    validator(UpdateProduct),
    updateProduct
)

module.exports = router
