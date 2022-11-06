const router = require("express").Router();
const {
  productController: {
    createProduct,
    getProducts,
    findProduct,
    deleteProduct,
    findByCategory,
    findSelectedProducts,
  },
} = require("../controllers");

router.post("/products/create", createProduct);
router.get("/products", getProducts);
router.get("/products/:id", findProduct);
router.get("/products/category/:type", findByCategory);
router.delete("/products/:id", deleteProduct);
router.post("/products/ids",findSelectedProducts);
module.exports = router;
