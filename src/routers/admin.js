const router = require('express').Router()
const {
    Authentication,
    roleAuth: {
        verifyRole,
        roles: { Admin },
    },
} = require('../middlewares')
const {
    adminController: { getAllIssues, deleteAIssue },
} = require('../controllers')

router.get('/admin/issues', Authentication, verifyRole(Admin), getAllIssues)
router.delete('/admin/issues/:id', Authentication, verifyRole(Admin), deleteAIssue)
module.exports = router
