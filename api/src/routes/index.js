const express = require('express')
const router = express.Router()

router.use('/admin/users', require('./admin/users'))
router.use('/admin/shifts', require('./admin/shifts'))

module.exports = router
