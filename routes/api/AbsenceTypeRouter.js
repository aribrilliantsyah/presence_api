const express = require('express')
const router = express.Router()
const AbsenceTypeController = require('../../controllers/api/AbsenceTypeController')
const ctl = new AbsenceTypeController()
const AuthMiddleware = require('../../middlewares/AuthMiddleware')

router.get('/absence_type/all', AuthMiddleware.check, ctl.all)
router.get('/absence_type', AuthMiddleware.check, ctl.list)
router.get('/absence_type/:id', AuthMiddleware.check, ctl.findById)
router.post('/absence_type', AuthMiddleware.check, ctl.create)
router.put('/absence_type/:id', AuthMiddleware.check, ctl.update)
router.delete('/absence_type/:id', AuthMiddleware.check, ctl.delete)
router.delete('/absence_type/soft/:id', AuthMiddleware.check, ctl.softDelete)
router.post('/absence_type/restore/:id', AuthMiddleware.check, ctl.restore)

module.exports = router
