
import express from 'express'
import authCtrl from '../contollers/authCtrl';
import { validateForgotPassword, validateLogin, validateRegister, validateRequestOTP, validateResetPassword, validateVerifyOTP } from '../validations/authValidations';
import auth from '../middleware/auth';

const router = express.Router()


router.post('/register', validateRegister,  authCtrl.register);
router.post('/login', validateLogin,  authCtrl.login);

router.post('/forgot-password', validateForgotPassword,  authCtrl.forgotPassword);
router.post('/reset-password', auth, validateResetPassword,  authCtrl.resetPassword);

router.post('/verify-otp', validateVerifyOTP,  authCtrl.verifyOTP);
router.post('/request-otp', validateRequestOTP,  authCtrl.requestOTP);

router.get('/retrieve-user-info', auth,  authCtrl.getUserInfo);






export default router