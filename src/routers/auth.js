const router = require('express').Router()
const { Authentication } = require('../middlewares')
const {
    authController: { signup, signin, signout, refresh },
} = require('../controllers')

router.post('/auth/signup', signup)
router.post('/auth/signin', signin)
router.patch('/auth/refresh', refresh)

router.use(Authentication) //below all the routes are protected
router.delete('/auth/signout', signout)

module.exports = router
