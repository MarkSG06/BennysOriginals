const express = require('express')
const router = express.Router()

router.use('/admin/users', require('./admin/users'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/customer/customers', require('./customer/customer'))

module.exports = router
