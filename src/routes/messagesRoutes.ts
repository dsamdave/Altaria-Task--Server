



import express from 'express'
import auth from '../middleware/auth'
import quesAnswerCtrl from '../contollers/freeQuesCtrl'
import { validateAnswers, validateFreeQuestions } from '../middleware/validations/appointmentValidations'
import messageCtrl from '../contollers/messageCtrl'
import { validateAddMessage } from '../middleware/validations/messageValidations'


const router = express.Router()

router.post('/messages', auth, validateAddMessage, messageCtrl.addMessage)

router.get('/conversations/:userID', auth, messageCtrl.getConversations)

router.get('/messages/:conversationID', auth, messageCtrl.getMessages)






export default router