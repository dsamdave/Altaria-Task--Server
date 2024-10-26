



import express from 'express'
import auth from '../middleware/auth'
import quesAnswerCtrl from '../contollers/freeQuesCtrl'
import { validateAnswers, validateFreeQuestions } from '../middleware/validations/appointmentValidations'
import messageCtrl from '../contollers/messageCtrl'
import { validateAddMessage } from '../middleware/validations/messageValidations'
import newsletterCtrl from '../contollers/newsletterCtrl'


const router = express.Router()

router.post('/newsletter/subscribe', newsletterCtrl.subscribe)

router.get('/newsletter/unsubscribe', newsletterCtrl.unsubscribe)

router.get('/newsletter/subscribers', newsletterCtrl.getAllSubscribers)







export default router