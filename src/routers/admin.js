const router = require('express').Router()
const {
    adminController: { test },
} = require('../controllers')

router.post('/admin', test)

module.exports = router
