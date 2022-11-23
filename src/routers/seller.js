const router = require('express').Router()
const {
    sellerController: { createProduct, updateProduct, deleteProduct },
} = require('../controllers')
const {
    Authentication,
    roleAuth: { roles, verifyRole },
} = require('../middlewares')
const { CreateProduct, UpdateProduct, checkProductId } = require('./schemas/sellerSchema')
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
    validator(checkProductId, src.PARAM),
    updateProduct
)
router.delete(
    '/products/:productId',
    Authentication,
    verifyRole(roles.seller),
    validator(checkProductId, src.PARAM),
    deleteProduct
)
module.exports = router
