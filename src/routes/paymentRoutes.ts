



import express from 'express'
import auth from '../middleware/auth'
import userCtrl from '../contollers/userCtrl'
import paymentCtrl from '../contollers/payment';


const router = express.Router()

router.post('/create-payment-intent', auth, paymentCtrl.createPaymentIntent);

router.get('/verify-payment/:paymentIntentId', auth, paymentCtrl.verifyPayment);







export default router