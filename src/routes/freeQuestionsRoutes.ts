



import express from 'express'
import auth from '../middleware/auth'
import quesAnswerCtrl from '../contollers/freeQuesCtrl'
import { validateAnswers, validateFreeQuestions } from '../middleware/validations/appointmentValidations'


const router = express.Router()

router.get('/questions', auth, quesAnswerCtrl.getAllQuestions)

router.post('/questions', auth, validateFreeQuestions, quesAnswerCtrl.createQuestion)

router.post('/answers/:questionId', auth, validateAnswers, quesAnswerCtrl.createAnswer)

router.get('/questions/:id', auth, quesAnswerCtrl.getOneQues)

router.get('/answers', auth, quesAnswerCtrl.getAllAnswers)

router.get('/answers/:id', auth, quesAnswerCtrl.getOneAnswer)

router.get('/answers-by-questions/:questionId', auth, quesAnswerCtrl.getAnswersByQuestions)







export default router