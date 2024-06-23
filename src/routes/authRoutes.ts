
import express from 'express'
import authCtrl from '../contollers/authCtrl'
import { validateLogin, validateRegister } from '../middleware/validations/authValidations'
import auth from '../middleware/auth'


const router = express.Router()

router.post('/register', validateRegister, authCtrl.register)

router.post('/login', validateLogin, authCtrl.login)

router.post('/refresh-token', authCtrl.refreshToken)

router.get('/e', auth, authCtrl.example)








export default router