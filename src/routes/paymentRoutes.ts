



import express from 'express'
import auth from '../middleware/auth'
import userCtrl from '../contollers/userCtrl'
import paymentCtrl from '../contollers/payment';


const router = express.Router()

router.post('/create-payment-intent', paymentCtrl.createPaymentIntent);

router.get('/verify-payment/:paymentIntentId', paymentCtrl.verifyPayment);







export default router