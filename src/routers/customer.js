const router = require("express").Router();

const {
  customerController: { signup, signin, signout },
} = require("../controllers");

router.post("/auth/signup", signup);
router.post('/auth/signin', signin)
router.delete('/auth/signout', signout)

module.exports = router;
