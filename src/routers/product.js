const router = require("express").Router();
const {
  productController: { createProduct, getProducts, findProduct },
} = require("../controllers");

router.post("/products/create", createProduct);
router.get("/products", getProducts);
router.get("/products/:id", findProduct);

module.exports = router;
