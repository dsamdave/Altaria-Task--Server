

import express from 'express'
import auth from '../middleware/auth'
import appointmentCtrl from '../contollers/appointmentsCtrl'
import { validateBookingAppointment } from '../middleware/validations/appointmentValidations'


const router = express.Router()

router.get('/appointments', auth, appointmentCtrl.getAllAppointments)

router.get('/appointments/:id', auth, appointmentCtrl.getOneAppointment)

router.get('/user-appointments', auth, appointmentCtrl.getUserAppointments)

router.post('/appointments', auth, validateBookingAppointment, appointmentCtrl.bookAppointment)








export default router