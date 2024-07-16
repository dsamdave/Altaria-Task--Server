
import express from 'express'
import authCtrl from '../contollers/authCtrl'
import { validateForgotPassword, validateLogin, validateRegister, validateResetPassword } from '../middleware/validations/authValidations'
import auth from '../middleware/auth'


const router = express.Router()

router.post('/register', authCtrl.register)

router.post('/login', validateLogin, authCtrl.login)

router.post('/refresh-token', authCtrl.refreshToken)

router.get('/e', auth, authCtrl.example)

router.post('/forgot-password', validateForgotPassword, authCtrl.forgotPassword)

router.post('/reset-password', validateResetPassword, authCtrl.resetPasswordWithOTP)

router.post('/update-basic-info', auth, authCtrl.updateBasicInfo)








export default router