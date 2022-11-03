const router = require("express").Router();
const {
  cartController: { getCart },
} = require("../controllers");

router.get("/", getCart);

module.exports = router;
