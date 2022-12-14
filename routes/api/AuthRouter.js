const express = require('express')
const router = express.Router()
const AuthController = require('../../controllers/api/AuthController')
const ctl = new AuthController()

router.post('/auth', ctl.auth)
router.post('/desktop_auth', ctl.desktop_auth)

module.exports = router
