
import express from 'express'
import authCtrl from '../contollers/authCtrl'
import { validateForgotPassword, validateLogin, validateOTP, validateRegister, validateRequestOTP, validateResetPassword } from '../middleware/validations/authValidations'
import auth from '../middleware/auth'


const router = express.Router()

router.post('/register', validateRegister, authCtrl.register)

router.post('/login', validateLogin, authCtrl.login)

router.post('/refresh-token', authCtrl.refreshToken)

router.post('/verify-OTP', validateOTP, authCtrl.verifyOtp)

router.post('/request-OTP', validateRequestOTP, authCtrl.requestOTP)

router.post('/forgot-password', validateForgotPassword, authCtrl.forgotPassword)

router.post('/reset-password', validateResetPassword, authCtrl.resetPasswordWithOTP)

router.post('/update-basic-info', auth, authCtrl.updateBasicInfo)

router.post('/update-avatar', auth, authCtrl.updateAvatar)

router.post('/update-location', authCtrl.updateUserLocation)

router.post('/test', authCtrl.test)








export default router