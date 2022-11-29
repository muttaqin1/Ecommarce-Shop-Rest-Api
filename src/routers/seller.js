const router = require('express').Router()
const {
    sellerController: { createProduct, updateProduct, deleteProduct },
} = require('../controllers')
const { Authentication } = require('../middlewares')
const { CreateProduct, UpdateProduct, checkProductId } = require('./schemas/sellerSchema')
const { validator, src } = require('../helpers/validators')
const imageUploader = require('../helpers/fileUpload/imageUpload')
router.post(
    '/products',
    //imageUploader('Banner', 'Banners'),
    Authentication,
    validator(CreateProduct),
    createProduct
)
router.put(
    '/products/:productId',
    Authentication,
    imageUploader('Banner', 'Banners'),
    validator(UpdateProduct),
    updateProduct
)
router.delete(
    '/products/:productId',
    Authentication,
    validator(checkProductId, src.PARAM),
    deleteProduct
)
module.exports = router
